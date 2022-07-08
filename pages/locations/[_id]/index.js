import useSWR from 'swr';
import { useRouter } from 'next/router';
import { styled } from '@stitches/react';
import Button from '../../../components/Button';
import Table from '../../../components/Table';
import Loading from '../../../components/Loading';
import PageContainer from '../../../components/PageContainer';
import Toolbar from '../../../components/Toolbar';
import Group from '../../../components/Group';
import { Grid, GridCell, Label, Value } from '../../../components/Grid';
import Alert from '../../../components/Alert';
import API from '../../../services/API';
import notify from '../../../services/notify';
import { IoPencil, IoTrash, IoDuplicate } from 'react-icons/io5';

export default function Location() {
  //

  const router = useRouter();
  const { _id } = router.query;

  const { data: location } = useSWR('/api/locations/' + _id);

  async function handleEditLocation() {
    router.push(`/locations/${_id}/edit`);
  }

  async function handleDuplicateLocation() {
    try {
      notify(_id, 'loading', 'A duplicar Location...');
      const response = await API({ service: 'locations', resourceId: _id, operation: 'duplicate', method: 'GET' });
      router.push(`/locations/${response._id}`);
      notify(_id, 'success', 'Location duplicado!');
    } catch (err) {
      console.log(err);
      notify(_id, 'error', 'Ocorreu um erro.');
    }
  }

  async function handleDeleteLocation() {
    try {
      notify(_id, 'loading', 'A eliminar Location...');
      await API({ service: 'locations', resourceId: _id, operation: 'delete', method: 'DELETE' });
      router.push('/locations');
      notify(_id, 'success', 'Location eliminado!');
    } catch (err) {
      console.log(err);
      notify(_id, 'error', 'Ocorreu um erro.');
    }
  }

  return location ? (
    <PageContainer title={'Locais › ' + location.title}>
      <Toolbar>
        <Button icon={<IoPencil />} label={'Editar'} onClick={handleEditLocation} />
        <Button icon={<IoDuplicate />} label={'Duplicar'} onClick={handleDuplicateLocation} />
        <Button
          icon={<IoTrash />}
          label={'Apagar'}
          color={'danger'}
          alert={
            <Alert
              color={'danger'}
              title={'Apagar Produto'}
              subtitle={'Tem a certeza que pretende apagar este local?'}
              message={'Esta acção é irreversível.'}
              onConfirm={handleDeleteLocation}
            />
          }
        />
      </Toolbar>

      <Group title={'Informações Gerais'}>
        <Grid>
          <GridCell>
            <Label>Título</Label>
            <Value>{location.title || '-'}</Value>
          </GridCell>
          <GridCell>
            <Label>Apicbase Outlet ID</Label>
            <Value>{location.apicbase?.outlet_id || '-'}</Value>
          </GridCell>
        </Grid>
      </Group>
    </PageContainer>
  ) : (
    <Loading />
  );
}
