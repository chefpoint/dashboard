import useSWR from 'swr';
import { useRouter } from 'next/router';
import pjson from '../package.json';

export default function Refresh() {
  const router = useRouter();
  const { data: version } = useSWR('/api/version');

  if (version) {
    if (version.latest != pjson.version) {
      router.reload();
    }
  }

  return <span style={{ fontSize: 5 }}>{version ? version.latest : 'loading'}</span>;
}
