import PageContainer from '../../components/PageContainer';
import Group from '../../components/Group';
import Toolbar from '../../components/Toolbar';
import Button from '../../components/Button';
import { Grid, GridCell, Label, Value } from '../../components/Grid';
import { DateRangePicker } from '@mantine/dates';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { Divider, LoadingOverlay, Select } from '@mantine/core';

export default function Reports() {
  //

  const [isLoading, setIsLoading] = useState(false);

  const [selectedDate, setSelectedDate] = useState([new Date(), new Date()]);
  const [selectedLocation, setSelectedLocation] = useState();

  // const [totalRevenue, setTotalRevenue] = useState(0);

  const queryString =
    (selectedLocation ? `&location_id=${selectedLocation}` : '') +
    (selectedDate[0] ? `&date_start=${selectedDate[0]?.toISOString()}` : '') +
    (selectedDate[1] ? `&date_end=${selectedDate[1]?.toISOString()}` : '');

  // const { data: totalRevenue } = useSWR(`/api/reports/total_revenue?${queryString}`);

  const { data: vegan } = useSWR(`/api/reports/variation_count?${queryString}&variation_id=62cbf1eb58deead62da775e6`);
  const { data: fish } = useSWR(`/api/reports/variation_count?${queryString}&variation_id=62cbf1eb58deead62da775e5`);
  const { data: meat } = useSWR(`/api/reports/variation_count?${queryString}&variation_id=62cbf1eb58deead62da775e4`);

  const { data: soup } = useSWR(`/api/reports/variation_count?${queryString}&variation_id=62cbf21058deead62da77616`);
  const { data: fruit } = useSWR(`/api/reports/variation_count?${queryString}&variation_id=62d0280e230ccd07b06f2c88`);
  const { data: salad } = useSWR(`/api/reports/variation_count?${queryString}&variation_id=62cbf1fa58deead62da775fd`);
  const { data: bread } = useSWR(`/api/reports/variation_count?${queryString}&variation_id=62cbf1f358deead62da775f3`);

  const { data: availableLocations } = useSWR('/api/locations/');

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
    const formatedLocations = [];
    availableLocations.forEach((location) => {
      formatedLocations.push({ label: location.title, value: location._id });
    });
    return formatedLocations;
  }

  return (
    <PageContainer title={'Reports'}>
      <LoadingOverlay visible={isLoading} />
      <Toolbar>
        <DateRangePicker placeholder='Pick dates range' value={selectedDate} onChange={handleChangeDate} />
        <Select
          placeholder='Location'
          data={formatAvailableLocations()}
          value={selectedLocation}
          clearable
          onChange={setSelectedLocation}
        />
      </Toolbar>

      {/* <Group title={'Visão Geral'}>
        <Grid>
          <GridCell>
            <Label>Faturação c/ IVA</Label>
            <Value>{`${totalRevenue?.totalWithTax.toFixed(2) || '0.00'}€`}</Value>
          </GridCell>
          <GridCell>
            <Label>Faturação s/ IVA</Label>
            <Value>{'524,26€' || '• • •'}</Value>
          </GridCell>
        </Grid>
      </Group> */}

      <Group title={'Produtos Comparticipados'}>
        <Grid>
          <GridCell>
            <Label>Prato Vegan</Label>
            <Value>{'524' || '• • •'}</Value>
          </GridCell>
          <GridCell>
            <Label>Prato de Peixe</Label>
            <Value>{'524,26€' || '• • •'}</Value>
          </GridCell>
          <GridCell>
            <Label>Prato de Carne</Label>
            <Value>{'524,26€' || '• • •'}</Value>
          </GridCell>
        </Grid>
        <Grid>
          <GridCell>
            <Label>Fruta</Label>
            <Value>{fruit || 0}</Value>
          </GridCell>
          <GridCell>
            <Label>Pão</Label>
            <Value>{bread || 0}</Value>
          </GridCell>
          <GridCell>
            <Label>Sopa</Label>
            <Value>{soup || 0}</Value>
          </GridCell>
          <GridCell>
            <Label>Salada</Label>
            <Value>{salad || 0}</Value>
          </GridCell>
        </Grid>
      </Group>

      <Divider my='xs' label='' labelPosition='center' />
    </PageContainer>
  );
}
