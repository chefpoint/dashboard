import useSWR from 'swr';

import FolderGrid from '../../components/pos/folders/folderGrid/FolderGrid';
import ProductGrid from '../../components/pos/products/productGrid/ProductGrid';
import Checkout from '../../components/pos/checkout/Checkout';

import Loading from '../../components/common/loading/Loading';

import styles from '../../styles/pos/POS.module.css';

import Overlay from '../../components/common/overlay/Overlay';

export default function PointOfSale() {
  const { data: customers } = useSWR('/api/customers/*');
  const { data: discounts } = useSWR('/api/discounts/*');
  const { data: layout } = useSWR('/api/layouts/621a229c9d0f1a427523c0bf');
  const { data: users } = useSWR('/api/users/*');

  return customers && discounts && layout && users ? (
    <div className={styles.container}>
      <div className={styles.leftSide}>
        <FolderGrid />
        <ProductGrid />
      </div>
      <div className={styles.rightSide}>
        <Checkout />
      </div>
      <Overlay visible={true} component={<Checkout />} />
    </div>
  ) : (
    <Loading />
  );
}
