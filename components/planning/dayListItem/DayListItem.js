import styles from './DayListItem.module.css';
import cn from 'classnames';
import { useState } from 'react';
import { Divider, Input, Card, Modal, Switch, Button, Text, Loading } from '@nextui-org/react';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
dayjs.extend(isoWeek);
import DayStatusBadge from '../dayStatusBadge/DayStatusBadge';
import RecipeSelectorCard from '../recipeSelectorCard/RecipeSelectorCard';
import { toast } from 'react-toastify';

export default function DayListItem({ day, recipes }) {
  //

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [specialDay, setSpecialDay] = useState(day.special_day ? true : false);
  const [specialDayIcon, setSpecialDayIcon] = useState(day.special_day ? day.special_day.icon : '');
  const [specialDayLabel, setSpecialDayLabel] = useState(day.special_day ? day.special_day.label : '');

  const [dishSelection, setDishSelection] = useState(day.dishes);
  // const [veganValue, setVeganValue] = useState(day.vegan);
  // const [fishValue, setFishValue] = useState(day.fish);
  // const [meatValue, setMeatValue] = useState(day.meat);

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
    const dateObj = new Date(date);
    return dateObj.getDate() == today.getDate() && dateObj.getMonth() == today.getMonth() && dateObj.getFullYear() == today.getFullYear();
  }

  async function saveChanges() {
    //
    setIsLoading(true);
    const notification = toast.loading('A guardar as alterações...', {
      autoClose: false,
    });

    if (!specialDay) day.special_day = null;
    else {
      day.special_day = {
        icon: specialDayIcon,
        label: specialDayLabel,
      };
    }

    day.dishes = dishSelection;

    day.is_public = false;
    if (day.dishes) {
      if (day.dishes.vegan && day.dishes.fish && day.dishes.meat) day.is_public = true;
      else day.is_public = false;
    } else day.is_public = false;

    await fetch('/api/planning/' + day.date, {
      method: 'PUT',
      body: JSON.stringify({
        date: day.date,
        is_public: day.is_public,
        special_day: day.special_day,
        dishes: day.dishes,
      }),
    })
      .then(() => {
        toast.update(notification, {
          type: 'success',
          render: 'Alterações publicadas!',
          isLoading: false,
          autoClose: 5000,
        });
        setIsLoading(false);
        setIsOpen(false);
      })
      .catch((err) => {
        console.log(err);
        toast.update(notification, {
          type: 'error',
          render: 'Erro ao publicar.',
          isLoading: false,
          autoClose: 5000,
        });
        setIsLoading(false);
        setIsOpen(true);
      });
  }

  function resetData() {
    setSpecialDay(day.special_day ? true : false);
    setSpecialDayIcon(day.special_day ? day.special_day.icon : '');
    setSpecialDayLabel(day.special_day ? day.special_day.label : '');
    setDishSelection(day.dishes);
  }

  async function clearData() {
    setIsLoading(true);
    delete day.specialDay; // Imediate in frontend
    delete day.dishes; // Imediate in frontend
    await fetch('/api/planning/' + day.date, {
      method: 'DELETE',
    })
      .then(() => {
        setIsLoading(false);
        setIsOpen(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
        setIsOpen(true);
      });
  }

  function getDayOfWeek(date) {
    return dayjs(date).isoWeekday();
  }

  function hasDishSelection(dish, type) {
    if (dish && dish[type]) return true;
    else return false;
  }

  return (
    <>
      <Modal blur open={isOpen} width={600} onOpen={resetData} onClose={() => setIsOpen(false)}>
        <Modal.Header>
          <Text b size={18} css={{ textTransform: 'uppercase' }}>
            {formatDate(day.date, 'full')}
          </Text>
        </Modal.Header>
        <Divider />
        <Modal.Body css={{ p: '$lg' }}>
          <Card bordered shadow={false}>
            <Card.Body css={{ d: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', p: '$sm' }}>
              <Text b size={18}>
                É um dia especial?
              </Text>
              <Switch size='lg' checked={specialDay ? true : false} onChange={(event) => setSpecialDay(event.target.checked)} />
            </Card.Body>
            {specialDay ? <Divider /> : null}
            {specialDay ? (
              <Card.Body css={{ d: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: '$sm', p: '$sm' }}>
                <Input
                  placeholder='Ícone'
                  clearable
                  bordered
                  aria-label='Special Day Icon'
                  value={specialDayIcon}
                  onChange={(event) => setSpecialDayIcon(event.target.value)}
                />
                <Input
                  placeholder='Descrição'
                  clearable
                  bordered
                  width='100%'
                  aria-label='Special Day Label'
                  value={specialDayLabel}
                  onChange={(event) => setSpecialDayLabel(event.target.value)}
                />
              </Card.Body>
            ) : null}
          </Card>
          <RecipeSelectorCard
            title='Receitas Vegan e Vegetarianas'
            color='$vegan'
            options={recipes.vegan}
            selection={dishSelection ? dishSelection.vegan : null}
            onChange={(selection) => setDishSelection({ ...dishSelection, vegan: selection })}
          />
          <RecipeSelectorCard
            title='Receitas de Peixe'
            color='$fish'
            options={recipes.fish}
            selection={dishSelection ? dishSelection.fish : null}
            onChange={(selection) => setDishSelection({ ...dishSelection, fish: selection })}
          />
          <RecipeSelectorCard
            title='Receitas de Carne'
            color='$meat'
            options={recipes.meat}
            selection={dishSelection ? dishSelection.meat : null}
            onChange={(selection) => setDishSelection({ ...dishSelection, meat: selection })}
          />

          {!isLoading ? (
            <Button onPress={saveChanges} css={{ width: '100%' }}>
              Guardar Alterações
            </Button>
          ) : (
            <Button disabled css={{ width: '100%' }}>
              <Loading type='points' color='currentColor' size='sm' />
            </Button>
          )}
          <Button disabled={isLoading} onPress={clearData} flat color='error' css={{ width: '100%' }}>
            Limpar Tudo
          </Button>
        </Modal.Body>
      </Modal>

      <Card
        className={cn({
          [styles.container]: true,
          [styles.weekend]: isWeekend(day.date),
          [styles.today]: isToday(day.date),
        })}
        onClick={() => setIsOpen(true)}
        css={{ gridColumn: getDayOfWeek(day.date) }}
      >
        <Card.Body css={{ px: '$sm', py: '$xs' }}>
          <div className={styles.date}>
            <div className={styles.day}>{formatDate(day.date, 'day')}</div>
            <div className={styles.dateInfo}>
              <div className={styles.month}>{formatDate(day.date, 'month')}</div>
              <div className={styles.weekday}>{formatDate(day.date, 'weekday')}</div>
            </div>
          </div>
        </Card.Body>
        <Divider />
        <Card.Body css={{ p: '$sm' }}>
          <div className={styles.recipes}>
            <DayStatusBadge variant='vegan' status={hasDishSelection(day.dishes, 'vegan')} />
            <DayStatusBadge variant='fish' status={hasDishSelection(day.dishes, 'fish')} />
            <DayStatusBadge variant='meat' status={hasDishSelection(day.dishes, 'meat')} />
          </div>
        </Card.Body>
      </Card>
    </>
  );
}
