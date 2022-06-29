import useSWR from 'swr';
import { useRouter } from 'next/router';
import { styled } from '@stitches/react';
import pjson from '../package.json';

const AppVersion = styled('div', {
  position: 'fixed',
  bottom: '0',
  width: '100%',
  textAlign: 'center',
  padding: '$lg',
  color: '$gray10',
  fontSize: '12px',
  fontWeight: '$medium',
  textTransform: 'uppercase',
});

export default function Refresh() {
  const router = useRouter();
  const { data: version } = useSWR('/api/version');

  if (version && version.latest != pjson.version) {
    router.reload();
  }

  return (
    <AppVersion>
      {pjson.name} - {pjson.version}
    </AppVersion>
  );
}
