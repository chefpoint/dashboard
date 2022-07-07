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

  const { data: checkingAccount } = useSWR('/api/checking_accounts/' + _id);

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
    <PageContainer title={'Contas Correntes › ' + checkingAccount.title}>
      <Toolbar>
        <Button icon={<IoPencil />} label={'Editar'} onClick={handleEditCheckingAccount} />
        <Button
          icon={<IoTrash />}
          label={'Eliminar'}
          color={'danger'}
          alert={
            <Alert
              color={'danger'}
              title={'Eliminar Conta Corrente'}
              subtitle={'Tem a certeza que pretende eliminar esta Conta Corrente?'}
              message={
                'Esta acção é irreversível. A conta ficará imediatamente indisponível para finalização de pagamentos. Os valores em dívida serão dados como pagos.'
              }
              onConfirm={handleDeleteCheckingAccount}
            />
          }
        />
      </Toolbar>

      <Group title={'Informações Gerais'}>
        <Grid>
          <GridCell>
            <Label>Título</Label>
            <Value>{checkingAccount.title || '-'}</Value>
          </GridCell>
          <GridCell>
            <Label>Cliente</Label>
            <Value>{checkingAccount.client_name || '-'}</Value>
          </GridCell>
          <GridCell>
            <Label>NIF</Label>
            <Value>{checkingAccount.tax_region + checkingAccount.tax_number || '-'}</Value>
          </GridCell>
        </Grid>
      </Group>
    </PageContainer>
  ) : (
    <Loading />
  );
}
