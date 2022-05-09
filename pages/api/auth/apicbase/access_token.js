import { withAuth } from '@clerk/nextjs/api';

/* OVERVIEW
 * 1. Get auth details for the current user from Clerk (GET Clerk API)
 * 2. Check if the token is still valid by introspecting (POST Apicbase API)
 * 3. If the token is valid, return the token to the client
 * 4. If the token is NOT valid, refresh it using the refresh_token
 * 5. If the refresh_token is not valid, user must reauthenticate
 */

export default withAuth(async (req, res) => {
  //
  // 1. GET AUTH DETAILS FROM CLERK
  // Get the current user's 'private_metadata' object from Clerk
  let currentUser;
  await fetch('https://api.clerk.dev/v1/users/' + req.auth.userId, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + process.env.CLERK_API_KEY,
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      currentUser = data;
    });

  // 2. CHECK IF USER ALREADY HAS TOKENS
  // Check if this user's 'private_metadata' object has value
  if (currentUser.private_metadata && currentUser.private_metadata.apicbase) {
    //
    // 2.1. CHECK IF TOKEN IS STILL VALID
    // Ask Apicbase API if access_token is valid
    // If the token is still valid, send the set back to the client
    if (currentUser.private_metadata.apicbase.access_token) {
      const tokenIsValid = await introspect(currentUser.private_metadata.apicbase.access_token);
      if (tokenIsValid) return res.status(200).json(currentUser.private_metadata.apicbase.access_token);
    }

    // 2.2. REFRESH THE TOKEN
    // If the token is NOT valid, try to refresh it
    // and send the new set back to the client
    if (currentUser.private_metadata.apicbase.refresh_token) {
      const newSetOfTokens = await refresh(currentUser.private_metadata.apicbase.refresh_token);
      if (!('error' in newSetOfTokens)) {
        await fetch('https://api.clerk.dev/v1/users/' + req.auth.userId + '/metadata', {
          method: 'PATCH',
          headers: {
            Authorization: 'Bearer ' + process.env.CLERK_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            private_metadata: {
              apicbase: {
                access_token: newSetOfTokens.access_token,
                refresh_token: newSetOfTokens.refresh_token,
              },
            },
          }),
        });
        // .then(() => res.status(200).send('OK'))
        // .catch(() => res.status(500).send('Not OK'));
        return res.status(200).json(newSetOfTokens.access_token);
      }
    }
  }

  // 3. GET A NEW PAIR OF TOKENS FROM THE ORIGINAL AUTH_CODE
  // If the token is STILL NOT valid, get a new token from the auth_code
  // that is stored in Clerk->UserId->private_metadata->apicbase_auth_code
  //   const { userId } = req.auth;
  //   const { apicbase_auth_code } = await clerk(userId, 'private_metadata');
  const firstSetOfTokens = await getFirstSetOfTokens(currentUser.private_metadata.apicbase.auth_code);
  if (firstSetOfTokens != null) {
    await fetch('https://api.clerk.dev/v1/users/' + req.auth.userId + '/metadata', {
      method: 'PATCH',
      headers: {
        Authorization: 'Bearer ' + process.env.CLERK_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        private_metadata: {
          apicbase: {
            access_token: firstSetOfTokens.access_token,
            refresh_token: firstSetOfTokens.refresh_token,
          },
        },
      }),
    });
    // .then(() => res.status(200).send('OK'))
    // .catch(() => res.status(500).send('Not OK'));

    return res.status(200).json(firstSetOfTokens.access_token);
  }

  // 4. THE USER MUST REAUTHENTICATE WITH APICABSE
  // If nothing above worked, then the user must re-authenticate with Apicbase again
  // Return with 401 Unauthorized
  return res.status(401).json({ error: 'All authentication methods failed. User must reauthorize with Apicbase.' });
  //
});

async function getFirstSetOfTokens(auth_code) {
  //
  // Refresh the tokens?
  let firstSetOfTokens;

  //
  // FIRST
  // Get a new token from the API
  await fetch('https://app.apicbase.com/oauth/token/', {
    method: 'POST',
    headers: { 'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: auth_code,
      client_id: process.env.NEXT_PUBLIC_APICBASE_CLIENT_ID,
      client_secret: process.env.APICBASE_CLIENT_SECRET,
    }),
  })
    .then((response) => response.json())
    .then((data) => (firstSetOfTokens = data));

  return firstSetOfTokens;
}

async function refresh(refresh_token) {
  //
  // Refresh the tokens?
  let newSetOfTokens;
  //
  // FIRST
  // Get a new token from the API
  await fetch('https://app.apicbase.com/oauth/token/', {
    method: 'POST',
    headers: { 'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refresh_token,
      client_id: process.env.NEXT_PUBLIC_APICBASE_CLIENT_ID,
      client_secret: process.env.APICBASE_CLIENT_SECRET,
    }),
  })
    .then((response) => response.json())
    .then((data) => (newSetOfTokens = data));

  return newSetOfTokens;

  // {
  //   access_token: 'N0wewJYnc9wKQlquCcONgxREncNAKv',
  //   expires_in: 604800,
  //   token_type: 'Bearer',
  //   scope: 'library',
  //   refresh_token: 'KjYSw3Wzqvnmatmz5KahcoWLzVKbg7'
  // }
}

async function introspect(token) {
  //
  // Is the token still active?
  let tokenValidity;

  // Ask Apicbase API to introspect the token
  await fetch('https://app.apicbase.com/oauth/introspect/', {
    method: 'POST',
    headers: { 'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: new URLSearchParams({
      token: token,
      client_id: process.env.NEXT_PUBLIC_APICBASE_CLIENT_ID,
      client_secret: process.env.APICBASE_CLIENT_SECRET,
    }),
  })
    .then((response) => response.json())
    .then((tokenInfo) => (tokenValidity = tokenInfo.active));

  // Return result to the caller
  return tokenValidity;
}
