import useSWR from 'swr';
import { useRouter } from 'next/router';
import Table from '../../components/Table';
import { DateTime } from 'luxon';
import PageContainer from '../../components/PageContainer';
import { Grid, GridCell, Label, Value } from '../../components/Grid';
import { useState } from 'react';

export default function Users() {
  //

  const router = useRouter();

  const { data: transactions } = useSWR('/api/transactions/');

  const [total, setTotal] = useState(0);

  function filterTransactions() {
    if (!transactions) return 0;
    let totalSold = 0;
    transactions.forEach((element) => {
      element.items.forEach((item) => {
        if (item.variation_id == '62cbf1eb58deead62da775e4') totalSold += 1;
      });
    });
    setTotal(totalSold);
  }

  return (
    <PageContainer title={'Transações'}>
      <Grid>
        <GridCell>
          <Label>Total</Label>
          <Value>{total}</Value>
        </GridCell>
      </Grid>
    </PageContainer>
  );
}
