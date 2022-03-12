import cn from 'classnames';
import Icon from '../icon/Icon';
import styles from './IconButton.module.css';
import Link from 'next/link';

export default function IconButton({ status = 'default', icon, label = 'Button', href, action }) {
  return href ? (
    <Link href={href}>
      <a
        className={cn({
          [styles.button]: true,
          [styles.default]: status == 'default',
          [styles.enabled]: status == 'enabled',
          [styles.disabled]: status == 'disabled',
        })}
      >
        <Icon name={icon} />
        <div className={styles.label}>{label}</div>
      </a>
    </Link>
  ) : (
    <div
      className={cn({
        [styles.button]: true,
        [styles.default]: status == 'default',
        [styles.enabled]: status == 'enabled',
        [styles.disabled]: status == 'disabled',
      })}
      onClick={status != 'disabled' ? action : ''}
    >
      <Icon name={icon} />
      <div className={styles.label}>{label}</div>
    </div>
  );
}
