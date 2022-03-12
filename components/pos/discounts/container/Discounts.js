import _ from 'lodash';
import useSWR from 'swr';
import styles from './Discounts.module.css';

import { useContext, useEffect } from 'react';
import { GlobalContext } from '../../../../services/context';
import DiscountCard from '../discountCard/DiscountCard';

// import orderManager from '../../../../utils/orderManager';

export default function Discounts() {
  //
  const { data: discounts } = useSWR('/api/discounts/*');
  const { currentOrder } = useContext(GlobalContext);

  // const validDiscounts = orderManager.getValidDiscountsForCurrentOrder(currentOrder.items, data.discounts);

  useEffect(() => {
    currentOrder.setAvailableDiscounts(discounts);
  });

  return currentOrder.discounts.length ? (
    <div className={styles.container}>
      {currentOrder.discounts.map((discount, index) => (
        <DiscountCard key={index} discount={discount} />
      ))}
    </div>
  ) : (
    ''
  );
}
