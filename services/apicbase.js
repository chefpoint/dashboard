// import lstore from '../utils/lstore';

// CONSTANTS
const APICBASE_API_BASE_URL = 'https://app.apicbase.com/api/v1';

export async function apicbaseAPI(endpoint, method, body) {
  //

  let apicbase_access_token;

  // FIRST
  // Check if token is still valid or get a new one
  await fetch('/api/auth/apicbase/access_token', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
    .then((response) => response.json())
    .then((data) => (apicbase_access_token = data))
    .catch((err) => {
      // If nothing worked user must reauthenticate with apicbase
      console.log(err);
    });

  // THIRD
  // Setup the request to Apicbase API
  let result;
  return fetch(APICBASE_API_BASE_URL + endpoint, {
    method: method,
    headers: {
      Authorization: 'Bearer ' + apicbase_access_token,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : null,
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.log('-----------------NOOOOOOO');
      console.log(err);
    });

  return result;
}
