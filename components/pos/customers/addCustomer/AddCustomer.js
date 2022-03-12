import styles from './AddCustomer.module.css';
import AddCustomerButton from '../addCustomerButton/AddCustomerButton';
import { useContext } from 'react';
import { GlobalContext } from '../../../../services/context';
import CustomerSelector from '../customerSelector/CustomerSelector';
import AddOnlyNIF from '../addOnlyNif/AddOnlyNIF';
import Icon from '../../../common/icon/Icon';

export default function AddCustomer() {
  const { overlay, currentOrder } = useContext(GlobalContext);

  function handleAddCustomer() {
    overlay.setComponent(<CustomerSelector />);
  }

  function handleChangeNIF() {
    overlay.setComponent(<AddOnlyNIF />);
  }

  function handleChangeCustomer() {
    currentOrder.setCustomer();
  }

  function getCorrectCustomerButton() {
    if (currentOrder.customer) {
      //
      if (currentOrder.customer.onlyNif) {
        return (
          <AddCustomerButton
            label={currentOrder.customer.nif.region + currentOrder.customer.nif.number}
            icon={<Icon name={'personfillquestionmark'} />}
            type={'primary'}
            action={handleChangeNIF}
          />
        );
      } else {
        return (
          <AddCustomerButton
            label={currentOrder.customer.name.first + ' ' + currentOrder.customer.name.last}
            icon={<Icon name={'personfillcheckmark'} />}
            type={'primary'}
            action={handleChangeCustomer}
          />
        );
      }
    } else {
      return <AddCustomerButton label={'Associar Cliente'} icon={<Icon name='personbadgeplus' />} type={'muted'} action={handleAddCustomer} />;
    }
  }

  return <div className={styles.container}>{getCorrectCustomerButton()}</div>;
}
