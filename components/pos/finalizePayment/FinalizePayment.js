import Pannel from '../../common/pannel/container/Pannel';
import Button from '../../common/button/Button';

import styles from './FinalizePayment.module.css';

import { useContext, useState } from 'react';
import { GlobalContext } from '../../../services/context';
import PaymentOption from './paymentOption/PaymentOption';
import Icon from '../../common/icon/Icon';
import PaidByCash from './methods/cash/PaidByCash';

export default function FinalizePayment() {
  const { currentOrder, overlay } = useContext(GlobalContext);

  const [selectedPaymentOption, setSelectedPaymentOption] = useState();

  function handleSelect(value) {
    setSelectedPaymentOption(value);
  }

  function handleInitiatePayment() {
    switch (selectedPaymentOption) {
      case 'card':
        console.log('card');
        break;
      case 'cash':
        overlay.setComponent(<PaidByCash />);
        break;
      case 'card':
        console.log('checking_account');
        break;
      default:
        break;
    }

    // currentOrder.clear();
    // overlay.setComponent();
  }

  return (
    <Pannel title={'Total Final'}>
      <div className={styles.orderTotal}>{currentOrder.totals.total.toFixed(2) + '€'}</div>
      <div className={styles.paymentOptionsContainer}>
        <PaymentOption
          value={'card'}
          icon={<Icon name={'creditcardfill'} />}
          label={'Multibanco'}
          selectedPaymentOption={selectedPaymentOption}
          onSelect={handleSelect}
        />
        <PaymentOption
          value={'cash'}
          icon={<Icon name={'eurosigncirclefill'} />}
          label={'Numerário'}
          selectedPaymentOption={selectedPaymentOption}
          onSelect={handleSelect}
        />
        <PaymentOption
          value={'checking_account'}
          icon={<Icon name={'listbulletrectanglefill'} />}
          label={'Conta Corrente'}
          selectedPaymentOption={selectedPaymentOption}
          onSelect={handleSelect}
        />
      </div>
      <Button label={'Iniciar Pagamento'} type={selectedPaymentOption ? 'primary' : 'disabled'} action={handleInitiatePayment} />
    </Pannel>
  );
}
