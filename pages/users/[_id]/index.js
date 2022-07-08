import useSWR from 'swr';
import { useRouter } from 'next/router';
import { Grid, GridCell, Label, Value } from '../../../components/Grid';
import Button from '../../../components/Button';
import Loading from '../../../components/Loading';
import PageContainer from '../../../components/PageContainer';
import Toolbar from '../../../components/Toolbar';
import Group from '../../../components/Group';
import Alert from '../../../components/Alert';
import API from '../../../services/API';
import notify from '../../../services/notify';
import { IoPencil, IoTrash } from 'react-icons/io5';

export default function Users() {
  //

  const router = useRouter();
  const { _id } = router.query;

  const { data: user } = useSWR(`/api/users/${_id}`);

  function handleEditUser() {
    router.push(`/users/${_id}/edit`);
  }

  async function handleDeleteUser() {
    try {
      notify(_id, 'loading', 'A eliminar User...');
      await API({ service: 'users', resourceId: _id, operation: 'delete', method: 'DELETE' });
      router.push('/users');
      notify(_id, 'success', 'User eliminado!');
    } catch (err) {
      console.log(err);
      notify(_id, 'error', 'Ocorreu um erro.');
    }
  }

  return user ? (
    <PageContainer title={'Users › ' + user.name}>
      <Toolbar>
        <Button icon={<IoPencil />} label={'Edit'} onClick={handleEditUser} />
        <Button
          icon={<IoTrash />}
          label={'Delete'}
          color={'danger'}
          alert={
            <Alert
              color={'danger'}
              title={'Eliminar Colaborador'}
              subtitle={'Tem a certeza que pretende eliminar este colaborador?'}
              message={
                'Esta acção é irreversível. O colaborador deixará imediatamente de ter acesso ao equipamento com a sua password.'
              }
              onConfirm={handleDeleteUser}
            />
          }
        />
      </Toolbar>

      <Group title={'Informações Gerais'}>
        <Grid>
          <GridCell>
            <Label>Nome</Label>
            <Value>{user.name || '-'}</Value>
          </GridCell>
          <GridCell>
            <Label>Posição</Label>
            <Value>{user.role || '-'}</Value>
          </GridCell>
          <GridCell>
            <Label>Password</Label>
            <Value>{user.pwd || '-'}</Value>
          </GridCell>
        </Grid>
      </Group>
    </PageContainer>
  ) : (
    <Loading />
  );
}
