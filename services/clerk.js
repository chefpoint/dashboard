export default async function getUserData(userId, parameter) {
  //
  // Outside promise storage
  let result;

  await fetch('https://api.clerk.dev/v1/users/' + userId, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + process.env.CLERK_API_KEY,
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      result = data[parameter];
    });

  return result;
}
