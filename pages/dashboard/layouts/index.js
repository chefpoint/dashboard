import styles from '../../../styles/dashboard/DashboardLayouts.module.css';
import Sidebar from '../../../components/dashboard/sidebar/container/Sidebar';
import useSWR from 'swr';
import LayoutListItem from '../../../components/dashboard/layouts/layoutListItem/LayoutListItem';
import Loading from '../../../components/common/loading/Loading';
import IconButton from '../../../components/common/iconButton/IconButton';

export default function DashboardLayouts() {
  //
  const { data: layouts } = useSWR('/api/layouts/*');

  return (
    <Sidebar title={'Layouts'}>
      <div className={styles.toolbar}>
        <IconButton icon={'plus'} label={'New Layout'} href={'/dashboard/layouts/new'} />
      </div>
      <div className={styles.layoutList}>{layouts ? layouts.map((layout) => <LayoutListItem key={layout._id} layout={layout} />) : <Loading />}</div>
    </Sidebar>
  );
}
