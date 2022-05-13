import styles from './Sidebar.module.css';
import SidebarButton from '../button/SidebarButton';
import { UserButton } from '@clerk/nextjs';

export default function Sidebar({ title, children }) {
  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <div className={styles.userContainer}>
          <UserButton showName />
        </div>
        <div className={styles.buttonsContainer}>
          <SidebarButton icon={'housefill'} title={'Home'} destination={'/'} />
          <SidebarButton icon={'checkmarkcirclefill'} title={'Planeamento'} destination={'/planning'} />
          <SidebarButton icon={'checkmarkcirclefill'} title={'Recrutamento'} destination={'/hr'} />
          {/* <SidebarButton icon={'chartbarxaxis'} title={'Relatórios'} destination={'/reports'} /> */}
          {/* <SidebarButton icon={'tagfill'} title={'Produtos'} destination={'/products'} /> */}
          {/* <SidebarButton icon={'person2fill'} title={'Clientes'} destination={'/customers'} /> */}
          {/* <SidebarButton icon={'keyfill'} title={'Colaboradores'} destination={'/users'} /> */}
          {/* <SidebarButton icon={'cubefill'} title={'Equipamentos'} destination={'/devices'} /> */}
          {/* <SidebarButton icon={'rectanglegrid2x2fill'} title={'Layouts'} destination={'/layouts'} /> */}
          {/* <SidebarButton icon={'gearshapefill'} title={'Definições'} destination={'/settings'} /> */}
        </div>
      </div>
      <div className={styles.pageContainer}>
        <p className={styles.pageTitle}>{title}</p>
        <div className={styles.pageContent}>{children}</div>
      </div>
    </div>
  );
}
