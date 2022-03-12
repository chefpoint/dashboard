import styles from '../../../styles/dashboard/DashboardProducts.module.css';
import Sidebar from '../../../components/dashboard/sidebar/container/Sidebar';
import useSWR from 'swr';
import Loading from '../../../components/common/loading/Loading';
import { useRouter } from 'next/router';
import VariationListItem from '../../../components/dashboard/products/variationListItem/VariationListItem';
import IconButton from '../../../components/common/iconButton/IconButton';

export default function DashboardLayoutView() {
  //
  const router = useRouter();
  const { _id } = router.query;

  const { data: layout } = useSWR('/api/layouts/' + _id);

  async function handleDelete() {
    const res = await fetch('/api/layout/' + _id, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
    });
    router.replace('/dashboard/layouts');
  }

  return (
    <Sidebar title={layout ? layout.title : '•••'}>
      <div className={styles.variations}>
        {layout ? layout.folders.map((variation) => <VariationListItem key={variation._id} variation={variation} />) : <Loading />}
        {/* <IconButton icon={'trash'} label={'Delete Layout'} action={handleDelete} /> */}
      </div>
    </Sidebar>
  );
}
