import styles from './DayListItem.module.css';
import cn from 'classnames';
import { useState } from 'react';
import { Modal, Select, Switch, Divider, Stack, Badge, Button, Space, Paper } from '@mantine/core';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
dayjs.extend(isoWeek);
import { Text } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { showNotification, updateNotification } from '@mantine/notifications';
import { GoCheck } from 'react-icons/go';
import DayStatusBadge from '../dayStatusBadge/DayStatusBadge';
import SelectRecipe from '../selectRecipe/SelectRecipe';

export default function DayListItem({ day, recipes }) {
  //

  const [opened, setOpened] = useState(false);
  const [checked, setChecked] = useState(false);
  const [veganValue, setVeganValue] = useState(day.vegan ? day.vegan : null);
  const [fishValue, setFishValue] = useState(day.fish ? day.fish : null);
  const [meatValue, setMeatValue] = useState(day.meat ? day.meat : null);

  function formatDate(date, type) {
    const dateObject = new Date(date);
    switch (type) {
      case 'weekday':
        return dateObject.toLocaleDateString('pt-pt', { weekday: 'short' });
      case 'day':
        return dateObject.toLocaleDateString('pt-pt', { day: 'numeric' });
      case 'month':
        return dateObject.toLocaleDateString('pt-pt', { month: 'long' });
      case 'daymonth':
        return dateObject.toLocaleDateString('pt-pt', { day: 'numeric', month: 'long' });
      case 'full':
        return dateObject.toLocaleDateString('pt-pt', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' });
      default:
        break;
    }
  }

  function isWeekend(date) {
    const weekday = dayjs(date).isoWeekday();
    if (weekday == 6 || weekday == 7) return true;
  }

  function isToday(date) {
    const today = new Date();
    date = new Date(date);
    return date.getDate() == today.getDate() && date.getMonth() == today.getMonth() && date.getFullYear() == today.getFullYear();
  }

  async function saveChanges() {
    //
    day.vegan = veganValue;
    day.fish = fishValue;
    day.meat = meatValue;

    showNotification({
      id: 'load-data-' + day.date,
      loading: true,
      title: 'Saving changes...',
      message: 'Please wait while changes are published...',
      autoClose: false,
      disallowClose: true,
    });

    await fetch('/api/planning/' + day.date, {
      method: 'PUT',
      body: JSON.stringify(day),
    }).then((response) => {
      console.log(response);
      updateNotification({
        id: 'load-data-' + day.date,
        color: 'teal',
        title: 'Alterações publicadas',
        message: 'Alterações guardadas e publicadas na plataforma.',
        // icon: <CheckIcon />,
      });
    });
    setOpened(false);
  }

  function clearData() {
    setVeganValue(null);
    setFishValue(null);
    setMeatValue(null);
  }

  function getDayOfWeek(date) {
    return dayjs(date).isoWeekday();
  }

  return (
    <>
      <Modal opened={opened} onClose={() => setOpened(false)} title={formatDate(day.date, 'full')}>
        <Divider my='sm' />
        <Space h='md' />
        <Stack justify='flex-start' spacing='xl'>
          <Switch label='Special Day' size='md' checked={checked} onChange={(event) => setChecked(event.currentTarget.checked)} />
          <SelectRecipe data={recipes.vegan} value={veganValue} onChange={setVeganValue} />
          <SelectRecipe data={recipes.fish} value={fishValue} onChange={setFishValue} />
          <SelectRecipe data={recipes.meat} value={meatValue} onChange={setMeatValue} />
          <Button onClick={saveChanges}>Guardar Alterações</Button>
          <Button onClick={clearData}>Limpar</Button>
        </Stack>
      </Modal>

      <div
        className={cn({
          [styles.container]: true,
          [styles.weekend]: isWeekend(day.date),
          [styles.today]: isToday(day.date),
        })}
        onClick={() => setOpened(true)}
        style={{ gridColumnStart: getDayOfWeek(day.date), gridColumnEnd: getDayOfWeek(day.date) }}
      >
        <Paper shadow='xs' p='xs'>
          <div className={styles.date}>
            <div className={styles.day}>{formatDate(day.date, 'day')}</div>
            <div className={styles.dateInfo}>
              <div className={styles.month}>{formatDate(day.date, 'month')}</div>
              <div className={styles.weekday}>{formatDate(day.date, 'weekday')}</div>
            </div>
          </div>
          <div className={styles.recipes}>
            <DayStatusBadge variant='vegan' status={veganValue ? true : false} />
            <DayStatusBadge variant='fish' status={fishValue ? true : false} />
            <DayStatusBadge variant='meat' status={meatValue ? true : false} />
          </div>
        </Paper>
      </div>
    </>
  );
}
