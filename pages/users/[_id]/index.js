import useSWR from 'swr';
import { useRouter } from 'next/router';
import { styled } from '@stitches/react';
import Button from '../../../components/Button';
import Loading from '../../../components/Loading';
import PageContainer from '../../../components/PageContainer';
import Toolbar from '../../../components/Toolbar';
import Group from '../../../components/Group';
import { toast } from 'react-toastify';
import Alert from '../../../components/Alert';
import { IoPencil, IoTrash, IoDuplicate } from 'react-icons/io5';

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
      // Display notification to the user
      toast.loading('Por favor aguarde...', { toastId: _id });
      // Send the request to the API
      const response = await fetch(`/api/users/${_id}/delete`, { method: 'DELETE' });
      // Parse the response to JSON
      const parsedResponse = await response.json();
      // Throw an error if the response is not OK
      if (!response.ok) throw new Error(parsedResponse.message);
      // Find the index of the updated customer in the original list...
      router.push('/users');
      // Update notification
      toast.update(_id, { render: 'Colaborador eliminado!', type: 'success', isLoading: false, autoClose: true });
    } catch (err) {
      console.log(err);
      toast.update(_id, { render: 'Ocorreu um erro inesperado.', type: 'error', isLoading: false });
    }
  }

  return user ? (
    <PageContainer title={'Colaboradores › ' + user.name}>
      <Toolbar>
        <Button icon={<IoPencil />} label={'Editar'} onClick={handleEditUser} />
        <Button
          icon={<IoTrash />}
          label={'Eliminar'}
          color={'danger'}
          alert={
            <Alert
              color={'danger'}
              title={'Eliminar Colaborador'}
              subtitle={'Tem a certeza que pretende eliminar este colaborador?'}
              message={'Esta acção é irreversível. O colaborador deixará imediatamente de ter acesso ao equipamento com a sua password.'}
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
