import styles from './DayStatusBadge.module.css';
import cn from 'classnames';
import { GoCheck, GoX } from 'react-icons/go';

export default function DayStatusBadge({ variant, status }) {
  //

  return (
    <div
      className={cn({
        [styles.container]: true,
        [styles.active]: status,
        [styles[variant]]: true,
      })}
    >
      <div className={styles.icon}>{status ? <GoCheck size='0.8em' /> : <GoX size='0.8em' />}</div>
      <div className={styles.label}>{variant}</div>
    </div>
  );
}
