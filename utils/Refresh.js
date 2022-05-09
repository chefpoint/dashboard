import useSWR from '../services/swr';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { GlobalContext } from '../services/context';
import pjson from '../package.json';

export default function Refresh() {
  const router = useRouter();
  const { data: version } = useSWR('/api/version');
  const { currentOrder } = useContext(GlobalContext);

  if (version) {
    if (version.latest != pjson.version) {
      if (!currentOrder.items.length) {
        router.reload();
      }
    }
  }

  return <span style={{ fontSize: 5 }}>{version ? version.latest : 'loading'}</span>;
}
