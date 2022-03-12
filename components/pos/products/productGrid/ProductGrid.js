import ProductSlot from '../productSlot/ProductSlot';
import styles from './ProductsGrid.module.css';

import useSWR from 'swr';

import { useContext } from 'react';
import { GlobalContext } from '../../../../services/context';

export default function ProductsGrid() {
  const { data: layout } = useSWR('/api/layouts/621a229c9d0f1a427523c0bf');

  const { currentFolder } = useContext(GlobalContext);

  const selectedFolderSlots = _.find(layout.folders, { _id: currentFolder._id });

  return (
    <div className={styles.container}>
      {selectedFolderSlots ? (
        selectedFolderSlots.slots.map(({ position, product }) => <ProductSlot key={position} product={product} />)
      ) : (
        <div>Select a folder</div>
      )}
    </div>
  );
}
