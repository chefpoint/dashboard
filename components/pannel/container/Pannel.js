import styles from './Pannel.module.css';

import PanelHeader from '../pannelHeader/PannelHeader';

export default function Pannel({ title, children }) {
  return (
    <div className={styles.pannel}>
      {title ? <PanelHeader title={title} /> : ''}
      <div className={styles.pannelContents}>{children}</div>
    </div>
  );
}
