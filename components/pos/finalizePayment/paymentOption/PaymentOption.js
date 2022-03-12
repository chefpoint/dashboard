import cn from 'classnames';
import styles from './PaymentOption.module.css';

export default function PaymentOption({ value, icon, label, selectedPaymentOption, onSelect }) {
  //
  let isThisPaymentOptionSelected = false;
  if (selectedPaymentOption == value) isThisPaymentOptionSelected = true;

  return (
    <div
      className={cn({
        [styles.paymentOption]: true,
        [styles.selected]: isThisPaymentOptionSelected,
      })}
      onClick={() => onSelect(value)}
    >
      <div className={styles.icon}>{icon}</div>
      <div className={styles.label}>{label}</div>
    </div>
  );
}
