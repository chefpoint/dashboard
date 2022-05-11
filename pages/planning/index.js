import styles from '../../styles/dashboard/DashboardPlanning.module.css';
import Sidebar from '../../components/sidebar/container/Sidebar';
import useSWR from 'swr';
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import DayListItem from '../../components/planning/dayListItem/DayListItem';
import { LoadingOverlay } from '@mantine/core';
import { Button, Modal, Text, Divider } from '@nextui-org/react';
import { DateRangePicker } from '@mantine/dates';
import { apicbaseAPI } from '../../services/apicbase';

export default function DashboardPlanning() {
  //

  // State definitions
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Date ranges
  const [dateRangeValue, setDateRangeValue] = useState(getRangeCurrentMonth());

  // Recipes storage
  const [veganRecipes, setVeganRecipes] = useState([]);
  const [fishRecipes, setFishRecipes] = useState([]);
  const [meatRecipes, setMeatRecipes] = useState([]);

  // Get days from API
  const { data: days } = useSWR('/api/planning/*');

  // GET RECIPES FROM APICBASE API
  useEffect(() => {
    (async function getRecipes() {
      try {
        setLoading(true);

        const vegan = await apicbaseAPI('/products/recipes?page_size=200&custom_fields={"Tipo de Receita": ["Vegan", "Vegetariana"]}', 'GET');
        const fish = await apicbaseAPI('/products/recipes?page_size=200&custom_fields={"Tipo de Receita": ["Peixe"]}', 'GET');
        const meat = await apicbaseAPI('/products/recipes?page_size=200&custom_fields={"Tipo de Receita": ["Carne"]}', 'GET');

        function formatRecipes(data) {
          return data.map((item) => ({
            apicbase_id: item.id,
            title_pt: item.name,
            title_en: item.custom_fields[6].value || '',
          }));
        }

        setVeganRecipes(formatRecipes(vegan.results));
        setFishRecipes(formatRecipes(fish.results));
        setMeatRecipes(formatRecipes(meat.results));

        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
        setError(true);
      }
    })();
  }, []);

  // FILTER DATES BASED ON INPUT
  function filterDaysToSelectedDate() {
    return days.filter(({ date }) => {
      //
      const objectDate = dayjs(date);
      const startDate = dayjs(dateRangeValue[0]);
      const endDate = dayjs(dateRangeValue[1]);
      //
      const isSame = objectDate.isSame(startDate, 'day') || objectDate.isSame(endDate, 'day');
      const isBetween = objectDate.isAfter(startDate) && objectDate.isBefore(endDate);
      //
      return isSame || isBetween;
    });
  }

  // SET DATE RANGE TO CURRENT MONTH
  function getRangeCurrentMonth() {
    const monthStart = dayjs().startOf('month').toDate();
    const monthEnd = dayjs().endOf('month').toDate();
    return [monthStart, monthEnd];
    // setDateRangeValue([monthStart, monthEnd]);
  }

  // SET DATE RANGE TO NEXT MONTH
  function getRangeNextMonth() {
    const monthStart = dayjs().add(1, 'month').startOf('month').toDate();
    const monthEnd = dayjs().add(1, 'month').endOf('month').toDate();
    return [monthStart, monthEnd];
    // setDateRangeValue([monthStart, monthEnd]);
  }

  // INIT AUTH
  async function initApicbaseAuth() {
    window.location.assign(
      'https://app.apicbase.com/oauth/authorize/?response_type=code&client_id=' + process.env.NEXT_PUBLIC_APICBASE_CLIENT_ID + '&scope=library'
    );
  }

  return (
    <>
      <Modal blur preventClose open={error} onClose={() => setError(false)}>
        <Modal.Header>
          <Text b size={18} css={{ textTransform: 'uppercase' }}>
            Apicbase Connection
          </Text>
        </Modal.Header>
        <Divider />
        <Modal.Body css={{ p: '$lg', gap: '$lg' }}>
          <Text size={18} css={{ textAlign: 'center' }}>
            Apicbase is required for this page to work.
          </Text>
          <Button size='lg' onClick={initApicbaseAuth}>
            Login with Apicbase
          </Button>
        </Modal.Body>
      </Modal>

      <Sidebar title={'Planeamento'}>
        <div className={styles.toolbar}>
          <DateRangePicker amountOfMonths={2} placeholder='Pick dates range' value={dateRangeValue} onChange={setDateRangeValue} />
          <Button onClick={() => setDateRangeValue(getRangeCurrentMonth)}>Current Month</Button>
          <Button onClick={() => setDateRangeValue(getRangeNextMonth)}>Next Month</Button>
        </div>
        <div className={styles.weekHeader}>
          <p>Segunda</p>
          <p>Terça</p>
          <p>Quarta</p>
          <p>Quinta</p>
          <p>Sexta</p>
          <p>Sábado</p>
          <p>Domingo</p>
        </div>
        <div className={styles.dayList}>
          {!loading && days ? (
            filterDaysToSelectedDate().map((day) => (
              <DayListItem key={day.date} day={day} recipes={{ vegan: veganRecipes, fish: fishRecipes, meat: meatRecipes }} />
            ))
          ) : (
            <LoadingOverlay visible={loading} />
          )}
        </div>
      </Sidebar>
    </>
  );
}
