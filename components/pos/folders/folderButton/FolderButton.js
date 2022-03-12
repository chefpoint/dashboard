import cn from 'classnames';
import styles from './FolderButton.module.css';

import { useContext } from 'react';
import { GlobalContext } from '../../../../services/context';

export default function FolderButton({ folder }) {
  const { currentFolder } = useContext(GlobalContext);

  function handleClick() {
    currentFolder.setId(folder._id);
  }

  return (
    <div
      className={cn({
        [styles.categoryBtn]: true,
        [styles.unselected]: folder._id != currentFolder._id,
        [styles.selected]: folder._id == currentFolder._id,
      })}
      onClick={handleClick}
    >
      <p>{folder.title}</p>
    </div>
  );
}
