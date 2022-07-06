import useSWR from 'swr';
import { useRouter } from 'next/router';
import Button from '../../../components/Button';
import Loading from '../../../components/Loading';
import PageContainer from '../../../components/PageContainer';
import Toolbar from '../../../components/Toolbar';
import Group from '../../../components/Group';
import { Grid, GridCell, Label, Value } from '../../../components/Grid';
import Alert from '../../../components/Alert';
import { IoPencil, IoTrash, IoDuplicate } from 'react-icons/io5';
import API from '../../../services/API';
import notify from '../../../services/notify';

export default function Device() {
  //

  const router = useRouter();
  const { _id } = router.query;

  const { data: device } = useSWR('/api/devices/' + _id);

  async function handleEditDevice() {
    router.push(`/devices/${_id}/edit`);
  }

  async function handleDuplicateDevice() {
    try {
      notify(_id, 'loading', 'A duplicar equipamento...');
      const response = await API({ service: 'devices', resourceId: _id, operation: 'duplicate', method: 'GET' });
      router.push(`/devices/${response._id}`);
      notify(_id, 'success', 'Equipamento duplicado!');
    } catch (err) {
      console.log(err);
      notify(_id, 'error', 'Ocorreu um erro.');
    }
  }

  async function handleDeleteDevice() {
    try {
      notify(_id, 'loading', 'A eliminar equipamento...');
      await API({ service: 'devices', resourceId: _id, operation: 'delete', method: 'DELETE' });
      router.push('/devices');
      notify(_id, 'success', 'Equipamento eliminado!');
    } catch (err) {
      console.log(err);
      notify(_id, 'error', 'Ocorreu um erro.');
    }
  }

  return device ? (
    <PageContainer title={'Equipamentos › ' + device.title}>
      <Toolbar>
        <Button icon={<IoPencil />} label={'Editar'} onClick={handleEditDevice} />
        <Button icon={<IoDuplicate />} label={'Duplicar'} onClick={handleDuplicateDevice} />
        <Button
          icon={<IoTrash />}
          label={'Eliminar'}
          color={'danger'}
          alert={
            <Alert
              color={'danger'}
              title={'Eliminar Equipamento'}
              subtitle={'Tem a certeza que pretende eliminar este equipamento?'}
              message={
                'Esta acção é irreversível. Perderá todas as configurações e o equipamento associado a este código deixará de funcionar imediatamente.'
              }
              onConfirm={handleDeleteDevice}
            />
          }
        />
      </Toolbar>

      <Group title={'Informações Gerais'}>
        <Grid>
          <GridCell>
            <Label>Nome</Label>
            <Value>{device.title || '-'}</Value>
          </GridCell>
          <GridCell>
            <Label>Código Único</Label>
            <Value>{device.code || '-'}</Value>
          </GridCell>
        </Grid>
      </Group>
    </PageContainer>
  ) : (
    <Loading />
  );
}
