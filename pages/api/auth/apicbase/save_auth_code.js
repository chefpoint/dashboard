import { requireAuth } from '@clerk/nextjs/api';

export default requireAuth(async (req, res) => {
  // Refuse if method is not POST
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' });
    return;
  }

  // Retrieve userId from authenticated request
  const { userId } = req.auth;

  console.log(req.auth);

  // Save the apicbaseAuthCode in Clerk's user profile
  await fetch('https://api.clerk.dev/v1/users/' + userId, {
    method: 'PATCH',
    headers: {
      Authorization: 'Bearer ' + process.env.CLERK_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      private_metadata: {
        apicbase: {
          auth_code: req.body.apicbaseAuthCode,
          access_token: 'null',
          refresh_token: 'null',
        },
      },
    }),
  })
    .then(() => res.status(200).send('OK'))
    .catch(() => res.status(500).send('Not OK'));
});
