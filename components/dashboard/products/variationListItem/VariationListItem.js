import styles from './VariationListItem.module.css';

export default function VariationListItem({ variation }) {
  //

  return (
    <div className={styles.container} key={variation._id}>
      <div className={styles.image} />
      <div className={styles.infoContainer}>
        <p className={styles.title}>{variation.title}</p>
        <p className={styles.variations}>{variation.price}€</p>
      </div>
    </div>
  );
}
