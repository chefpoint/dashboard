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

export default function Layout() {
  //

  const router = useRouter();
  const { _id } = router.query;

  const { data: layout } = useSWR(`/api/layouts/${_id}`);

  async function handleEditLayout() {
    router.push(`/layouts/${_id}/edit`);
  }

  async function handleDuplicateLayout() {
    try {
      notify(_id, 'loading', 'A duplicar Layout...');
      const response = await API({ service: 'layouts', resourceId: _id, operation: 'duplicate', method: 'GET' });
      router.push(`/layouts/${response._id}`);
      notify(_id, 'success', 'Layout duplicado!');
    } catch (err) {
      console.log(err);
      notify(_id, 'error', 'Ocorreu um erro.');
    }
  }

  async function handleDeleteLayout() {
    try {
      notify(_id, 'loading', 'A eliminar Layout...');
      await API({ service: 'layouts', resourceId: _id, operation: 'delete', method: 'DELETE' });
      router.push('/layouts');
      notify(_id, 'success', 'Layout eliminado!');
    } catch (err) {
      console.log(err);
      notify(_id, 'error', 'Ocorreu um erro.');
    }
  }

  return layout ? (
    <PageContainer title={'Layouts › ' + layout.title}>
      <Toolbar>
        <Button icon={<IoPencil />} label={'Editar'} onClick={handleEditLayout} />
        <Button icon={<IoDuplicate />} label={'Duplicar'} onClick={handleDuplicateLayout} />
        <Button
          icon={<IoTrash />}
          label={'Apagar'}
          color={'danger'}
          alert={
            <Alert
              color={'danger'}
              title={'Apagar Equipamento'}
              subtitle={'Tem a certeza que pretende apagar este equipamento?'}
              message={
                'Esta acção é irreversível. Perderá todas as configurações e o equipamento associado a este código deixará de funcionar imediatamente.'
              }
              onConfirm={handleDeleteLayout}
            />
          }
        />
      </Toolbar>

      <Group title={'Informações Gerais'}>
        <Grid>
          <GridCell>
            <Label>Nome</Label>
            <Value>{layout.title || '-'}</Value>
          </GridCell>
          <GridCell>
            <Label>Código Único</Label>
            <Value>{layout.code || '-'}</Value>
          </GridCell>
        </Grid>
      </Group>
    </PageContainer>
  ) : (
    <Loading />
  );
}
