import cn from 'classnames';
import styles from './UserButton.module.css';

import { useContext } from 'react';
import { GlobalContext } from '../../../../services/context';
import UserUnlock from '../userUnlock/UserUnlock';
import Icon from '../../../common/icon/Icon';

export default function UserButton() {
  const { lockStatus, overlay } = useContext(GlobalContext);

  function handleLockUnlock() {
    if (lockStatus.currentUser) {
      lockStatus.setCurrentUser();
    } else {
      overlay.setComponent(<UserUnlock />);
    }
  }

  return (
    <div onClick={handleLockUnlock}>
      <div
        className={cn({
          [styles.button]: true,
          [styles.locked]: !lockStatus.currentUser,
          [styles.unlocked]: lockStatus.currentUser,
        })}
      >
        {lockStatus.currentUser ? (
          <p className={styles.label}>
            <Icon name={'lockopenfill'} />
            {lockStatus.currentUser.name}
          </p>
        ) : (
          <p className={styles.label}>
            <Icon name={'lockfill'} />
            Caixa Bloqueada
          </p>
        )}
      </div>
      {!lockStatus.currentUser ? <div className={styles.lockOverlay}></div> : ''}
    </div>
  );
}
