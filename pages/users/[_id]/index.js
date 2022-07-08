import useSWR from 'swr';
import { useRouter } from 'next/router';
import { Grid, GridCell, Label, Value } from '../../../components/Grid';
import Button from '../../../components/Button';
import Loading from '../../../components/Loading';
import PageContainer from '../../../components/PageContainer';
import { LoadingOverlay } from '@mantine/core';
import Toolbar from '../../../components/Toolbar';
import Group from '../../../components/Group';
import Alert from '../../../components/Alert';
import API from '../../../services/API';
import notify from '../../../services/notify';
import { IoPencil, IoTrash } from 'react-icons/io5';
import { useState } from 'react';

export default function Users() {
  //

  const router = useRouter();
  const { _id } = router.query;

  const { data: user } = useSWR(`/api/users/${_id}`);

  const [isLoading, setIsLoading] = useState(false);

  function handleEditUser() {
    router.push(`/users/${_id}/edit`);
  }

  async function handleDeleteUser() {
    try {
      setIsLoading(true);
      notify(_id, 'loading', 'Deleting User...');
      await API({ service: 'users', resourceId: _id, operation: 'delete', method: 'DELETE' });
      router.push('/users');
      notify(_id, 'success', 'User deleted!');
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      notify(_id, 'error', 'An error occurred.');
    }
  }

  return user ? (
    <PageContainer title={'Users › ' + user.name}>
      <LoadingOverlay visible={isLoading} />
      <Toolbar>
        <Button icon={<IoPencil />} label={'Edit'} onClick={handleEditUser} />
        <Button
          icon={<IoTrash />}
          label={'Delete'}
          color={'danger'}
          alert={
            <Alert
              color={'danger'}
              title={'Delete User'}
              subtitle={'Are you sure you want to delete this User?'}
              message={
                'This action is irreversible and immediate. The User will be immediately blocked from accessing devices with this password.'
              }
              onConfirm={handleDeleteUser}
            />
          }
        />
      </Toolbar>

      <Group title={'General Details'}>
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
