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
import { IoPencil, IoTrash } from 'react-icons/io5';
import Alert from '../../../components/Alert';

export default function CheckingAccount() {
  //

  const router = useRouter();
  const { _id } = router.query;

  const { data: checkingAccount } = useSWR(`/api/checking_accounts/${_id}`);

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
    </PageContainer>
  ) : (
    <Loading />
  );
}
