import Link from 'next/link';
import styles from './ProductListItem.module.css';

export default function ProductListItem({ product }) {
  //

  return (
    <Link href={'/dashboard/products/' + product._id}>
      <a className={styles.container} key={product._id}>
        <div className={styles.image} />
        <div className={styles.infoContainer}>
          <p className={styles.title}>{product.title}</p>
          <p className={styles.variations}>{product.variations.length} variations</p>
        </div>
      </a>
    </Link>
  );
}
