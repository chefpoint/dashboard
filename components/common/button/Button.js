import cn from 'classnames';
import styles from './Button.module.css';

export default function Button({ label = 'Button', type = 'primary', action }) {
  return (
    <button
      className={cn({
        [styles.button]: true,
        [styles.primary]: type == 'primary',
        [styles.secondary]: type == 'secondary',
        [styles.muted]: type == 'muted',
        [styles.danger]: type == 'danger',
        [styles.disabled]: type == 'disabled',
      })}
      onClick={type == 'disabled' ? null : action}
    >
      {label}
    </button>
  );
}
