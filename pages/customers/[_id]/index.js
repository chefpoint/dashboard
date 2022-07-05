import useSWR from 'swr';
import { useContext } from 'react';
import { useRouter } from 'next/router';
import { styled } from '@stitches/react';
import { DateTime } from 'luxon';
import Button from '../../../components/Button';
import Toolbar from '../../../components/Toolbar';
import Group from '../../../components/Group';
import Table from '../../../components/Table';
import Alert from '../../../components/Alert';
import { IoPencil, IoTrash, IoDuplicate } from 'react-icons/io5';
import Loading from '../../../components/Loading';
import PageContainer from '../../../components/PageContainer';

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

  async function handleDuplicateCustomer() {
    // Try to update the current customer
    try {
      // Send the request to the API
      const response = await fetch(`/api/customers/${_id}/duplicate`, { method: 'GET' });
      // Parse the response to JSON
      const parsedResponse = await response.json();
      // Throw an error if the response is not OK
      if (!response.ok) throw new Error(parsedResponse.message);
      // Find the index of the updated customer in the original list...
      router.push('/customers/' + parsedResponse._id);
    } catch (err) {
      console.log(err);
      // setErrorMessage('Ocorreu um erro inesperado.');
    }
  }

  async function handleDeleteCustomer() {
    // Try to update the current customer
    try {
      // Send the request to the API
      const response = await fetch(`/api/customers/${_id}/delete`, { method: 'DELETE' });
      // Parse the response to JSON
      const parsedResponse = await response.json();
      // Throw an error if the response is not OK
      if (!response.ok) throw new Error(parsedResponse.message);
      // Find the index of the updated customer in the original list...
      router.push('/customers');
    } catch (err) {
      console.log(err);
      // setErrorMessage('Ocorreu um erro inesperado.');
    }
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
        <Button icon={<IoPencil />} label={'Editar'} onClick={handleEditCustomer} />
        <Button icon={<IoDuplicate />} label={'Duplicar'} onClick={handleDuplicateCustomer} />
        <Button
          icon={<IoTrash />}
          label={'Apagar'}
          color={'danger'}
          alert={
            <Alert
              color={'danger'}
              title={'Apagar Cliente'}
              subtitle={'Tem a certeza que pretende apagar este cliente?'}
              message={
                'Todas as transações associadas a este cliente serão convertidas para Consumidor Final, mas a informação fiscal mantém-se inalterada.'
              }
              onConfirm={handleDeleteCustomer}
            />
          }
        />
      </Toolbar>

      <Group title={'Informações Gerais'}>
        <Grid>
          <GridCell>
            <Label>Nome</Label>
            <Value>{customer.first_name + ' ' + customer.last_name}</Value>
          </GridCell>
          <GridCell>
            <Label>NIF</Label>
            <Value>{customer.tax_country + customer.tax_number || '-'}</Value>
          </GridCell>
          <GridCell>
            <Label>Email de Contacto</Label>
            <Value>{customer.contact_email || '-'}</Value>
          </GridCell>
          <GridCell>
            <Label>Nr. Cartão TP</Label>
            <Value>{customer.reference || '-'}</Value>
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
