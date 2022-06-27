import useSWR from 'swr';
import { useRouter } from 'next/router';
import { styled } from '@stitches/react';
import { DateTime } from 'luxon';
import Button from '../../components/Button';
import Toolbar from '../../components/Toolbar';
import Group from '../../components/Group';
import Table from '../../components/Table';
import Loading from '../../components/Loading';
import PageContainer from '../../components/PageContainer';

const Grid = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  borderRadius: '$md',
  gap: '$md',
});

const GridCell = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  padding: '$md',
  borderRadius: '$md',
  backgroundColor: '$gray1',
  gap: '$xs',
  variants: {
    clickable: {
      true: {
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: '$gray4',
        },
      },
    },
  },
});

const Label = styled('p', {
  fontSize: '12px',
  fontWeight: '$medium',
  textTransform: 'uppercase',
  color: '$gray11',
});

const Value = styled('p', {
  fontSize: '18px',
  fontWeight: '$medium',
  color: '$gray12',
});

export default function Customer() {
  //

  const router = useRouter();
  const { _id } = router.query;

  const { data: customer } = useSWR('/api/customers/' + _id);
  const { data: transactions } = useSWR('/api/transactions/filter/customer/' + _id);

  function handleEditCustomer() {
    console.log();
  }

  function handleDeleteCustomer() {
    console.log();
  }

  function handleEmailCustomer() {
    console.log();
  }

  function handleTransactionRowClick(row) {
    router.push('/transactions/' + row._id);
  }

  function formatTableData() {
    // Transform data for table
    if (!transactions) return;
    // Sort array
    transactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    // Transform data for table
    const arrayOfData = [];
    transactions.forEach((t) => {
      //
      const formated = {
        _id: t._id,
        date_and_time: DateTime.fromISO(t.timestamp).toFormat('yyyy-mm-dd HH:mm'),
        location: t.location?.title,
        total_amount: t.payment?.total_amount + '€',
      };
      // console.log(formated);
      arrayOfData.push(formated);
    });
    // Return array
    return arrayOfData;
  }

  return customer ? (
    <PageContainer title={'Clientes › Detalhe'}>
      <Toolbar>
        <Button onClick={handleEditCustomer}>Editar Cliente</Button>
        <Button color={'danger'} onClick={handleDeleteCustomer}>
          Apagar Cliente
        </Button>
      </Toolbar>

      <Group title={'Informações Gerais'}>
        <Grid>
          <GridCell>
            <Label>Nome</Label>
            <Value>{customer.first_name + ' ' + customer.last_name}</Value>
          </GridCell>
          <GridCell>
            <Label>NIF</Label>
            <Value>{customer.tax_country + customer.tax_number}</Value>
          </GridCell>
          <GridCell>
            <Label>Email de Contacto</Label>
            <Value>{customer.contact_email || '-'}</Value>
          </GridCell>
        </Grid>
      </Group>

      <Table
        columns={[
          { label: 'Date & Time', key: 'date_and_time' },
          { label: 'Location', key: 'location' },
          { label: 'Total', key: 'total_amount' },
        ]}
        data={formatTableData()}
        onRowClick={handleTransactionRowClick}
      />
    </PageContainer>
  ) : (
    <Loading />
  );
}
