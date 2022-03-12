import Link from 'next/link';
import styles from './LayoutListItem.module.css';

export default function LayoutListItem({ layout }) {
  //

  return (
    <Link href={'/dashboard/layouts/' + layout._id}>
      <a className={styles.container} key={layout._id}>
        <div className={styles.image} />
        <div className={styles.infoContainer}>
          <p className={styles.title}>{layout.title}</p>
        </div>
      </a>
    </Link>
  );
}
