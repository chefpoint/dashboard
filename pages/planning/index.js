import styles from '../../styles/dashboard/DashboardLayouts.module.css';
import Sidebar from '../../components/sidebar/container/Sidebar';
import useSWR from 'swr';
// import PlanningListItem from '../../components/planning/layoutListItem/LayoutListItem';
import Loading from '../../components/loading/Loading';
import IconButton from '../../components/iconButton/IconButton';

export default function DashboardPlanning() {
  //
  const { data: days } = useSWR('/api/planning/*');

  return (
    <Sidebar title={'Planeamento'}>
      <div className={styles.toolbar}>
        <IconButton icon={'plus'} label={'Adicionar Dia'} href={'/planning/new'} />
      </div>
      {/* <div className={styles.dayList}>{days ? days.map((day) => <PlanningListItem key={layout._id} layout={layout} />) : <Loading />}</div> */}
    </Sidebar>
  );
}
