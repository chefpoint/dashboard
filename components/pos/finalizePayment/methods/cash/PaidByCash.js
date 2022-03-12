import Pannel from '../../../../common/pannel/container/Pannel';
import Button from '../../../../common/button/Button';

import Player from '../../../../../utils/Player';
import loadingDots from '/public/media/animations/loading-dots.json';

import styles from './PaidByCash.module.css';

import { useContext } from 'react';
import { GlobalContext } from '../../../../../services/context';

export default function PaidByCash() {
  const { currentOrder, overlay } = useContext(GlobalContext);

  // Run on initialize component
  (function initiateCashRequest() {
    console.log('initiated');
  })();

  function handleCancelPayment() {
    overlay.setComponent();
  }

  return (
    <Pannel>
      <div className={styles.container}>
        <div className={styles.player}>
          <Player animationData={loadingDots} />
        </div>
        <div className={styles.orderTotal}>{currentOrder.totals.total.toFixed(2) + '€'}</div>
        <div className={styles.paymentMethod}>Numerário</div>
      </div>
      <Button label={'Cancelar'} type={'muted'} action={handleCancelPayment} />
    </Pannel>
  );
}
