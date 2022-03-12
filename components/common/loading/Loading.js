import styles from './Loading.module.css';

import Player from '../../../utils/Player';
import loadingDots from '/public/media/animations/loading-dots.json';

export default function Loading() {
  return (
    <div className={styles.container}>
      <Player animationData={loadingDots} />
    </div>
  );
}
