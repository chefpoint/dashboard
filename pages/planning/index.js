import styles from '../../styles/dashboard/DashboardPlanning.module.css';
import Sidebar from '../../components/sidebar/container/Sidebar';
import useSWR from 'swr';
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import DayListItem from '../../components/planning/dayListItem/DayListItem';
import { LoadingOverlay } from '@mantine/core';
import { Button, Modal, Text, Divider, Loading, Spacer } from '@nextui-org/react';
import { DateRangePicker } from '@mantine/dates';
import { apicbaseAPI } from '../../services/apicbase';
import { GoSync } from 'react-icons/go';

export default function DashboardPlanning() {
  //

  //
  // Get days from API
  const { data: daysFromDB } = useSWR('/api/planning/*');

  // State definitions
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isRefreshhing, setIsRefreshing] = useState(false);

  // Date ranges
  const [dateRangeValue, setDateRangeValue] = useState(getRangeCurrentMonth());

  // Recipes storage
  const [recipes, setRecipes] = useState(null);

  // GET RECIPES FROM APICBASE API
  useEffect(() => {
    setIsLoading(true);
    getRecipes();
  }, []);

  async function refreshRecipes() {
    setIsRefreshing(true);
    await getRecipes();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  }

  async function getRecipes() {
    try {
      const vegan = await apicbaseAPI(
        '/products/recipes?page_size=200&custom_fields={"Tipo de Receita": ["Vegan", "Vegetariana"]}',
        'GET'
      );
      const fish = await apicbaseAPI(
        '/products/recipes?page_size=200&custom_fields={"Tipo de Receita": ["Peixe"]}',
        'GET'
      );
      const meat = await apicbaseAPI(
        '/products/recipes?page_size=200&custom_fields={"Tipo de Receita": ["Carne"]}',
        'GET'
      );

      function formatRecipes(data) {
        return data.map((item) => ({
          apicbase_id: item.id,
          apicbase_url: item.web_page,
          title_pt: item.name,
          title_en: item.custom_fields[6].value || '',
        }));
      }

      setRecipes({
        vegan: formatRecipes(vegan.results),
        fish: formatRecipes(fish.results),
        meat: formatRecipes(meat.results),
      });

      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      seIstError(true);
    }
  }

  function getDaysFromRange() {
    //
    const daysArray = [];
    let currentDate = new Date(dateRangeValue[0]);

    while (currentDate <= new Date(dateRangeValue[1])) {
      const thisDaysDate = dayjs(currentDate).format('YYYY-MM-DD');
      const dayExistsInDB = daysFromDB.find((item) => item.date == thisDaysDate);
      daysArray.push({ ...dayExistsInDB, date: thisDaysDate });
      // Use UTC date to prevent problems with time zones and DST
      currentDate.setUTCDate(currentDate.getUTCDate() + 1);
    }

    return daysArray;
  }

  // SET DATE RANGE TO CURRENT MONTH
  function getRangeCurrentMonth() {
    const monthStart = dayjs().startOf('month').toDate();
    const monthEnd = dayjs().endOf('month').toDate();
    return [monthStart, monthEnd];
  }

  // SET DATE RANGE TO NEXT MONTH
  function getRangeNextMonth() {
    const monthStart = dayjs().add(1, 'month').startOf('month').toDate();
    const monthEnd = dayjs().add(1, 'month').endOf('month').toDate();
    return [monthStart, monthEnd];
  }

  // INIT AUTH
  async function initApicbaseAuth() {
    window.location.assign(
      'https://app.apicbase.com/oauth/authorize/?response_type=code&client_id=' +
        process.env.NEXT_PUBLIC_APICBASE_CLIENT_ID +
        '&scope=library'
    );
  }

  return (
    <>
      <Modal blur preventClose open={isError}>
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
          <DateRangePicker
            amountOfMonths={2}
            placeholder='Pick dates range'
            value={dateRangeValue}
            onChange={setDateRangeValue}
          />
          <Button onClick={() => setDateRangeValue(getRangeCurrentMonth)}>Current Month</Button>
          <Button onClick={() => setDateRangeValue(getRangeNextMonth)}>Next Month</Button>
          <Button disabled={isRefreshhing || isLoading} onClick={() => refreshRecipes()}>
            {isRefreshhing || isLoading ? (
              <Loading size='xs' />
            ) : (
              <>
                <GoSync />
                <Spacer x={0.25} />
                Sync Apicbase
              </>
            )}
          </Button>
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
          {!isLoading && daysFromDB ? (
            getDaysFromRange().map((day) => <DayListItem key={day.date} day={day} recipes={recipes} />)
          ) : (
            <LoadingOverlay visible={isLoading} />
          )}
        </div>
      </Sidebar>
    </>
  );
}
