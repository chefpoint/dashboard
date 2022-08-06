import useSWR from 'swr';
import { useRouter } from 'next/router';
import API from '../../../services/API';
import notify from '../../../services/notify';
import Button from '../../../components/Button';
import Loading from '../../../components/Loading';
import PageContainer from '../../../components/PageContainer';
import Toolbar from '../../../components/Toolbar';
import { Grid, GridCell, Label, Value } from '../../../components/Grid';
import Group from '../../../components/Group';
import { DateTime } from 'luxon';
import Table from '../../../components/Table';
import { IoPencil, IoTrash } from 'react-icons/io5';
import Alert from '../../../components/Alert';

export default function CheckingAccount() {
  //

  const router = useRouter();
  const { _id } = router.query;

  const { data: checkingAccount } = useSWR(`/api/checking_accounts/${_id}`);
  const { data: transactions } = useSWR(`/api/transactions/filter?checking_account_id=${_id}`);

  function handleEditCheckingAccount() {
    router.push(router.asPath + '/edit');
  }

  async function handleDeleteCheckingAccount() {
    try {
      notify(_id, 'loading', 'Por favor aguarde...');
      await API({ service: 'checking_accounts', resourceId: _id, operation: 'delete', method: 'DELETE' });
      router.push('/checking_accounts');
      notify(_id, 'success', 'Conta Corrente eliminada!');
    } catch (err) {
      console.log(err);
      notify(_id, 'error', 'Ocorreu um erro inesperado.');
    }
  }

  function handleTransactionRowClick(row) {
    router.push(`/transactions/${row._id}`);
  }

  function formatTableData() {
    // Transform data for table
    if (!transactions) return;
    // Sort array
    transactions.sort((a, b) => b.createdAt - a.createdAt);
    // Transform data for table
    const arrayOfData = [];
    transactions.forEach((t) => {
      //
      const formated = {
        _id: t._id,
        date_and_time: DateTime.fromJSDate(t.createdAt).toLocaleString({
          ...DateTime.DATE_SHORT,
          month: 'long',
          hour: 'numeric',
          minute: 'numeric',
        }),
        location: t.location?.title,
        total_amount: `${t.payment?.amount_total || '?'}€`,
      };
      arrayOfData.push(formated);
    });
    // Return array
    return arrayOfData;
  }

  return checkingAccount ? (
    <PageContainer title={'Checking Accounts › ' + checkingAccount.title}>
      <Toolbar>
        <Button icon={<IoPencil />} label={'Edit'} onClick={handleEditCheckingAccount} />
        <Button
          icon={<IoTrash />}
          label={'Delete'}
          color={'danger'}
          alert={
            <Alert
              color={'danger'}
              title={'Delete Checking Account'}
              subtitle={'Are you sure you want to delete this Checking Account?'}
              message={
                'This action is irreversible and immediate. This account will be unavailable to accept new transactions. The unpaid amount will be considered fully paid.'
              }
              onConfirm={handleDeleteCheckingAccount}
            />
          }
        />
      </Toolbar>

      <Group title={'General Info'}>
        <Grid>
          <GridCell>
            <Label>Title</Label>
            <Value>{checkingAccount.title || '-'}</Value>
          </GridCell>
          <GridCell>
            <Label>Client</Label>
            <Value>{checkingAccount.client_name || '-'}</Value>
          </GridCell>
          <GridCell>
            <Label>Tax ID</Label>
            <Value>{checkingAccount.tax_region + checkingAccount.tax_number || '-'}</Value>
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
