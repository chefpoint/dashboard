import useSWR from 'swr';
import { useRouter } from 'next/router';
import Table from '../../components/Table';
import { DateTime } from 'luxon';
import PageContainer from '../../components/PageContainer';
import { Grid, GridCell, Label, Value } from '../../components/Grid';
import { useEffect, useState } from 'react';

export default function Users() {
  //

  const router = useRouter();

  const { data: transactions } = useSWR('/api/transactions/');

  const [totalCarne, setTotalCarne] = useState(0);
  const [totalPeixe, setTotalPeixe] = useState(0);
  const [totalVegan, setTotalVegan] = useState(0);

  function countCarne() {
    if (!transactions) return 0;
    let totalSold = 0;
    transactions.forEach((element) => {
      element.items.forEach((item) => {
        if (item.variation_id == '62cbf1eb58deead62da775e4') totalSold += 1;
      });
    });
    setTotalCarne(totalSold);
  }

  function countPeixe() {
    if (!transactions) return 0;
    let totalSold = 0;
    transactions.forEach((element) => {
      element.items.forEach((item) => {
        if (item.variation_id == '62cbf1eb58deead62da775e5') totalSold += 1;
      });
    });
    setTotalPeixe(totalSold);
  }

  function countVegan() {
    if (!transactions) return 0;
    let totalSold = 0;
    transactions.forEach((element) => {
      element.items.forEach((item) => {
        if (item.variation_id == '62cbf1eb58deead62da775e6') totalSold += 1;
      });
    });
    setTotalVegan(totalSold);
  }

  useEffect(() => {
    countCarne();
    countPeixe();
    countVegan();
  });

  return (
    <PageContainer title={'Transações'}>
      <Grid>
        <GridCell>
          <Label>Carne</Label>
          <Value>{totalCarne}</Value>
        </GridCell>
        <GridCell>
          <Label>Peixe</Label>
          <Value>{totalPeixe}</Value>
        </GridCell>
        <GridCell>
          <Label>Vegan</Label>
          <Value>{totalVegan}</Value>
        </GridCell>
      </Grid>
    </PageContainer>
  );
}
