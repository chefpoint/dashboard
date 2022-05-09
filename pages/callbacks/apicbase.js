import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function AuthCallback() {
  //
  const { query } = useRouter();

  useEffect(() => {
    (async function sendData() {
      fetch('/api/auth/apicbase/save_auth_code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apicbaseAuthCode: query.code }),
      })
        .then((response) => {
          console.log(response);
          window.location = '/planning';
        })
        .catch((err) => {
          console.log(err);
        });
    })();
  });

  return <div style={{ color: 'white' }}>{query.code}</div>;
}
