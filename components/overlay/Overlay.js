import cn from 'classnames';
import styles from './Overlay.module.css';

import { useContext } from 'react';
import { GlobalContext } from '../../../services/context';

export default function Overlay() {
  const { overlay } = useContext(GlobalContext);

  return overlay.component ? (
    <div
      className={cn({
        [styles.overlay]: true,
        // [styles.active]: overlay.component,
      })}
    >
      {overlay.component}
    </div>
  ) : (
    ''
  );
}
