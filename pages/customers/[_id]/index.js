import useSWR from 'swr';
import { useRouter } from 'next/router';
import Button from '../../../components/Button';
import Loading from '../../../components/Loading';
import PageContainer from '../../../components/PageContainer';
import Toolbar from '../../../components/Toolbar';
import Group from '../../../components/Group';
import { DateTime } from 'luxon';
import { Grid, GridCell, Label, Value } from '../../../components/Grid';
import Alert from '../../../components/Alert';
import Table from '../../../components/Table';
import API from '../../../services/API';
import notify from '../../../services/notify';
import { IoPencil, IoTrash, IoDuplicate } from 'react-icons/io5';

export default function Customer() {
  //

  const router = useRouter();
  const { _id } = router.query;

  const { data: customer } = useSWR(`/api/customers/${_id}`);
  const { data: transactions } = useSWR(`/api/transactions/filter/customer/${_id}`);

  async function handleEditCustomer() {
    router.push(`/customers/${_id}/edit`);
  }

  async function handleDuplicateCustomer() {
    try {
      notify(_id, 'loading', 'Duplicating customer...');
      const response = await API({ service: 'customers', resourceId: _id, operation: 'duplicate', method: 'GET' });
      router.push(`/customers/${response._id}`);
      notify(_id, 'success', 'Customer duplicated!');
    } catch (err) {
      console.log(err);
      notify(_id, 'error', 'Ocorreu um erro.');
    }
  }

  async function handleDeleteCustomer() {
    try {
      notify(_id, 'loading', 'A eliminar produto...');
      await API({ service: 'customers', resourceId: _id, operation: 'delete', method: 'DELETE' });
      router.push('/customers');
      notify(_id, 'success', 'Produto eliminado!');
    } catch (err) {
      console.log(err);
      notify(_id, 'error', 'Ocorreu um erro.');
    }
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
    <PageContainer
      title={
        'Customers › ' +
        (customer.first_name || customer.last_name ? `${customer.first_name} ${customer.last_name}` : 'New Customer')
      }
    >
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

      <Group title={'Customer Details'}>
        <Grid>
          <GridCell>
            <Label>Nome</Label>
            <Value>
              {customer.first_name || customer.last_name ? `${customer.first_name} ${customer.last_name}` : '-'}
            </Value>
          </GridCell>
          <GridCell>
            <Label>Birthday</Label>
            <Value>
              {customer.birthday
                ? DateTime.fromISO(customer.birthday).toLocaleString({
                    ...DateTime.DATE_SHORT,
                    month: 'long',
                  })
                : '-'}
            </Value>
          </GridCell>
        </Grid>
        <Grid>
          <GridCell>
            <Label>Reference</Label>
            <Value>{customer.reference || '-'}</Value>
          </GridCell>
        </Grid>
      </Group>

      <Group title={'Invoicing'}>
        <Grid>
          <GridCell>
            <Label>Send Invoices to Email</Label>
            <Value>{customer.send_invoices ? 'Yes' : 'No'}</Value>
          </GridCell>
          <GridCell>
            <Label>Tax ID</Label>
            <Value>
              {customer.tax_region && customer.tax_number ? `${customer.tax_region}${customer.tax_number}` : '-'}
            </Value>
          </GridCell>
        </Grid>
        <Grid>
          <GridCell>
            <Label>Contact Email</Label>
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
