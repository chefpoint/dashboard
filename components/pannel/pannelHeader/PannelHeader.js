import styles from './PannelHeader.module.css';

import { useContext } from 'react';
import { GlobalContext } from '../../../../services/context';
import Icon from '../../icon/Icon';

export default function PannelHeader({ title = 'Untitled' }) {
  //
  const { overlay } = useContext(GlobalContext);

  function handleClick() {
    overlay.setComponent();
  }

  return (
    <div className={styles.header}>
      <div className={styles.closeIcon} onClick={handleClick}>
        <Icon name='xmark' />
      </div>
      <div className={styles.title}>
        <p>{title}</p>
      </div>
    </div>
  );
}
