import cn from 'classnames';

import Button from '../../../common/button/Button';
import styles from './OrderTotals.module.css';

import { useContext } from 'react';
import { GlobalContext } from '../../../../services/context';
import FinalizePayment from '../../finalizePayment/FinalizePayment';
import PaidByCash from '../../finalizePayment/methods/cash/PaidByCash';

export default function OrderTotals() {
  const { currentOrder, overlay } = useContext(GlobalContext);

  function handleFinalize() {
    // overlay.setComponent(<FinalizePayment />);
    overlay.setComponent(<PaidByCash />);
  }

  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <div className={styles.row}>
          <p className={styles.subtotalLabel}>Subtotal</p>
          <p className={styles.subtotalValue}>{currentOrder.totals ? currentOrder.totals.subtotal.toFixed(2) : '0.00'}€</p>
        </div>
        <div
          className={cn({
            [styles.row]: true,
            [styles.active]: currentOrder.totals && currentOrder.totals.discounts > 0,
          })}
        >
          <p className={styles.discountsLabel}>Valor dos Descontos</p>
          <p className={styles.discountsValue}>{currentOrder.totals ? currentOrder.totals.discounts.toFixed(2) : '0.00'}€</p>
        </div>
      </div>
      <Button
        label={currentOrder.items.length ? 'Total = ' + currentOrder.totals.total.toFixed(2) + '€' : 'No Items Yet'}
        type={currentOrder.items.length ? 'primary' : 'disabled'}
        action={handleFinalize}
      />
    </div>
  );
}
