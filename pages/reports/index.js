import PageContainer from '../../components/PageContainer';
import Group from '../../components/Group';
import Toolbar from '../../components/Toolbar';
import { Grid } from '../../components/Grid';
import { DateRangePicker } from '@mantine/dates';
import StatCard from '../../components/StatCard';

import { useState } from 'react';
import useSWR from 'swr';
import { Divider, LoadingOverlay, Select } from '@mantine/core';

export default function Reports() {
  //

  const [isLoading, setIsLoading] = useState(false);

  const [selectedDate, setSelectedDate] = useState([new Date(), new Date()]);
  const [selectedLocation, setSelectedLocation] = useState();

  // const [totalRevenue, setTotalRevenue] = useState(0);

  const { data: availableLocations } = useSWR('/api/locations/');

  const queryString =
    (selectedLocation ? `&location_id=${selectedLocation}` : '') +
    (selectedDate[0] ? `&date_start=${selectedDate[0]?.toISOString()}` : '') +
    (selectedDate[1] ? `&date_end=${selectedDate[1]?.toISOString()}` : '');

  const { data: totalRevenue } = useSWR(`/api/reports/total_revenue?${queryString}`);

  const { data: vegan } = useSWR(`/api/reports/variation_count?${queryString}&variation_id=62cbf1eb58deead62da775e6`);
  const { data: fish } = useSWR(`/api/reports/variation_count?${queryString}&variation_id=62cbf1eb58deead62da775e5`);
  const { data: meat } = useSWR(`/api/reports/variation_count?${queryString}&variation_id=62cbf1eb58deead62da775e4`);

  const { data: soup } = useSWR(`/api/reports/variation_count?${queryString}&variation_id=62cbf21058deead62da77616`);
  const { data: fruit } = useSWR(`/api/reports/variation_count?${queryString}&variation_id=62d0280e230ccd07b06f2c88`);
  const { data: salad } = useSWR(`/api/reports/variation_count?${queryString}&variation_id=62cbf1fa58deead62da775fd`);
  const { data: bread } = useSWR(`/api/reports/variation_count?${queryString}&variation_id=62cbf1f358deead62da775f3`);

  function handleChangeDate(selection) {
    const utcStartDate = selection[0]
      ? new Date(selection[0].getTime() - selection[0].getTimezoneOffset() * 60000)
      : null;
    const utcEndDate = selection[1]
      ? new Date(selection[1].getTime() - selection[1].getTimezoneOffset() * 60000)
      : null;
    console.log(selection);
    setSelectedDate([utcStartDate, utcEndDate]);
  }

  function formatAvailableLocations() {
    if (!availableLocations) return [];
    const formatedLocations = [{ label: 'All Locations', value: null }];
    availableLocations.forEach((location) => {
      formatedLocations.push({ label: location.title, value: location._id });
    });
    return formatedLocations;
  }

  return (
    <PageContainer title={'Reports'}>
      <LoadingOverlay visible={isLoading} />
      <Toolbar>
        <DateRangePicker
          placeholder='Pick dates range'
          value={selectedDate}
          maxDate={new Date()}
          onChange={handleChangeDate}
        />
        <Select
          placeholder='Locations'
          data={formatAvailableLocations()}
          value={selectedLocation}
          onChange={setSelectedLocation}
        />
      </Toolbar>

      <Grid>
        <StatCard
          title={'Faturação s/ IVA'}
          value={totalRevenue?.totalWithoutTax ? `${totalRevenue?.totalWithoutTax?.toFixed(2)}€` : null}
        />
      </Grid>

      <Divider my='xs' labelPosition='center' />
      <Grid>
        <StatCard title={'Prato Vegan'} value={vegan} />
        <StatCard title={'Prato de Peixe'} value={fish} />
        <StatCard title={'Prato de Carne'} value={meat} />
      </Grid>
      <Grid>
        <StatCard title={'Sopa'} value={soup} />
        <StatCard title={'Fruta'} value={fruit} />
        <StatCard title={'Pão'} value={bread} />
        <StatCard title={'Salada'} value={salad} />
      </Grid>
      <Divider my='xs' labelPosition='center' />
    </PageContainer>
  );
}
