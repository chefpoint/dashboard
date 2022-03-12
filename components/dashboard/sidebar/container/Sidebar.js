import styles from './Sidebar.module.css';
import SidebarButton from '../button/SidebarButton';

export default function Sidebar({ title, children }) {
  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <div className={styles.buttonsContainer}>
          <SidebarButton icon={'housefill'} title={'Home'} destination={''} />
          <SidebarButton icon={'chartbarxaxis'} title={'Reports'} destination={'/reports'} />
          <SidebarButton icon={'tagfill'} title={'Products'} destination={'/products'} />
          <SidebarButton icon={'person2fill'} title={'Customers'} destination={'/customers'} />
          <SidebarButton icon={'keyfill'} title={'Users'} destination={'/users'} />
          <SidebarButton icon={'cubefill'} title={'Devices'} destination={'/devices'} />
          <SidebarButton icon={'rectanglegrid2x2fill'} title={'Layouts'} destination={'/layouts'} />
          <SidebarButton icon={'gearshapefill'} title={'Settings'} destination={'/settings'} />
        </div>
      </div>
      <div className={styles.pageContainer}>
        <p className={styles.pageTitle}>{title}</p>
        <div className={styles.pageContent}>{children}</div>
      </div>
    </div>
  );
}
