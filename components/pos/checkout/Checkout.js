import styles from './Checkout.module.css';

import AddCustomer from '../customers/addCustomer/AddCustomer';
import OrderDetails from '../order/orderDetails/OrderDetails';
import Totals from '../order/orderTotals/OrderTotals';
import UserLock from '../users/userButton/UserButton';
import Discounts from '../discounts/container/Discounts';

export default function Checkout() {
  return (
    <div className={styles.checkoutPanel}>
      <UserLock />
      <AddCustomer />
      <div className={styles.innerContainer}>
        <OrderDetails />
        <Discounts />
      </div>
      <Totals />
    </div>
  );
}
