import styles from './OrderDetails.module.css';
import OrderItem from '../orderItem/OrderItem';

import { useContext } from 'react';
import { GlobalContext } from '../../../../services/context';

export default function OrderDetails() {
  const { currentOrder } = useContext(GlobalContext);

  return (
    <div className={styles.container}>
      {currentOrder.items.length ? (
        currentOrder.items.map((item, index) => <OrderItem key={index} item={item} />)
      ) : (
        <p style={{ textAlign: 'center' }}>Current order is empty</p>
      )}
    </div>
  );
}
