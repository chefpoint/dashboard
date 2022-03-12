import cn from 'classnames';
import styles from './SidebarButton.module.css';
import Icon from '../../../common/icon/Icon';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function SidebarButton({ icon, title, destination, active }) {
  const router = useRouter();

  const href = '/dashboard' + destination;

  return (
    <Link href={href}>
      <a
        className={cn({
          [styles.button]: true,
          [styles.active]: router.asPath.includes(title.toLowerCase()),
        })}
      >
        <Icon name={icon} />
        <div className={styles.title}>{title}</div>
      </a>
    </Link>
  );
}
