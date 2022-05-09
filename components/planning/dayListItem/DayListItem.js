import styles from './DayListItem.module.css';
import cn from 'classnames';
import { useState } from 'react';
import { Modal, Switch, Divider, Stack, Button, Space, Paper, Group, Input, SimpleGrid } from '@mantine/core';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
dayjs.extend(isoWeek);
import { showNotification, updateNotification } from '@mantine/notifications';
import { GoCheck } from 'react-icons/go';
import DayStatusBadge from '../dayStatusBadge/DayStatusBadge';
import SelectRecipe from '../selectRecipe/SelectRecipe';

export default function DayListItem({ day, recipes }) {
  //

  const [opened, setOpened] = useState(false);

  const [specialDay, setSpecialDay] = useState(day.special_day ? true : false);
  const [specialDayIcon, setSpecialDayIcon] = useState(day.special_day ? day.special_day.icon : '');
  const [specialDayLabel, setSpecialDayLabel] = useState(day.special_day ? day.special_day.label : '');

  const [veganValue, setVeganValue] = useState(day.vegan ? day.vegan.apicbase_id : null);
  const [fishValue, setFishValue] = useState(day.fish ? day.fish.apicbase_id : null);
  const [meatValue, setMeatValue] = useState(day.meat ? day.meat.apicbase_id : null);

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

  function getRecipeById(list, id) {
    const result = list.find((item) => item.value == id);
    if (result) return { apicbase_id: result.value, title_pt: result.title_pt, title_en: result.title_en };
    else return null;
  }

  async function saveChanges() {
    //

    if (specialDay) {
      day.special_day = {
        icon: specialDayIcon,
        label: specialDayLabel,
      };
    }

    day.vegan = getRecipeById(recipes.vegan, veganValue);
    day.fish = getRecipeById(recipes.fish, fishValue);
    day.meat = getRecipeById(recipes.meat, meatValue);

    const randomId = performance.now();

    showNotification({
      id: 'load-data-' + randomId,
      loading: true,
      title: 'A guardar alterações...',
      message: 'Por favor aguarde enquanto as alterações são publicadas...',
      autoClose: false,
      disallowClose: true,
    });

    await fetch('/api/planning/' + day.date, {
      method: 'PUT',
      body: JSON.stringify(day),
    }).then(() => {
      updateNotification({
        id: 'load-data-' + randomId,
        color: 'teal',
        title: 'Alterações publicadas',
        message: 'Alterações guardadas e publicadas na plataforma.',
        icon: <GoCheck />,
      });
    });
    setOpened(false);
  }

  function resetData() {
    setSpecialDay(day.specialDay ? true : false);
    setSpecialDayIcon(day.specialDay ? day.specialDay.icon : '');
    setSpecialDayLabel(day.specialDay ? day.specialDay.label : '');
    setVeganValue(day.vegan ? day.vegan.apicbase_id : null);
    setFishValue(day.fish ? day.fish.apicbase_id : null);
    setMeatValue(day.meat ? day.meat.apicbase_id : null);
  }

  function clearData() {
    setSpecialDay(false);
    setSpecialDayIcon('');
    setSpecialDayLabel('');
    setVeganValue(null);
    setFishValue(null);
    setMeatValue(null);
  }

  function getDayOfWeek(date) {
    return dayjs(date).isoWeekday();
  }

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => {
          resetData();
          setOpened(false);
        }}
        title={formatDate(day.date, 'full')}
      >
        <Divider my='sm' />
        <Space h='md' />
        <Stack justify='flex-start' spacing='sm'>
          <Switch label='Special Day' size='md' checked={specialDay} onChange={(event) => setSpecialDay(event.currentTarget.checked)} />
          {specialDay ? (
            <SimpleGrid cols={2}>
              <Input title='Icon' value={specialDayIcon} onChange={(event) => setSpecialDayIcon(event.currentTarget.value)}></Input>
              <Input title='Label' value={specialDayLabel} onChange={(event) => setSpecialDayLabel(event.currentTarget.value)}></Input>
            </SimpleGrid>
          ) : null}
          <SelectRecipe label='Receita Vegan' data={recipes.vegan} value={veganValue} onChange={setVeganValue} />
          <SelectRecipe label='Receita de Peixe' data={recipes.fish} value={fishValue} onChange={setFishValue} />
          <SelectRecipe label='Receita de Carne' data={recipes.meat} value={meatValue} onChange={setMeatValue} />
          <Space h='md' />
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
