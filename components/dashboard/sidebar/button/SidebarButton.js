import cn from 'classnames';
import styles from './SidebarButton.module.css';
import Icon from '../../../common/icon/Icon';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function SidebarButton({ icon, title, destination }) {
  //

  const router = useRouter();

  // Is current button selected

  let isActive;
  if (destination == '/' && router.asPath == '/') {
    isActive = true;
  } else if (router.asPath != '/' && destination != '/') {
    isActive = router.asPath.includes(destination);
  }

  return (
    <Link href={destination}>
      <a
        className={cn({
          [styles.button]: true,
          [styles.active]: isActive,
        })}
      >
        <Icon name={icon} />
        <div className={styles.title}>{title}</div>
      </a>
    </Link>
  );
}
