import useSWR from 'swr';
import { useRouter } from 'next/router';
import Button from '../../../components/Button';
import { toast } from 'react-toastify';
import Loading from '../../../components/Loading';
import PageContainer from '../../../components/PageContainer';
import Toolbar from '../../../components/Toolbar';
import Group from '../../../components/Group';
import { Grid, GridCell, Label, Value } from '../../../components/Grid';
import Alert from '../../../components/Alert';
import API from '../../../services/API';
import notify from '../../../services/notify';
import { IoPencil, IoTrash, IoDuplicate } from 'react-icons/io5';

export default function ViewProduct() {
  //

  const router = useRouter();
  const { _id } = router.query;

  const { data: product } = useSWR(`/api/products/${_id}`);

  async function handleEditProduct() {
    router.push(`/products/${_id}/edit`);
  }

  async function handleDuplicateProduct() {
    try {
      notify(_id, 'loading', 'A duplicar produto...');
      const response = await API({ service: 'products', resourceId: _id, operation: 'duplicate', method: 'GET' });
      router.push(`/products/${response._id}`);
      notify(_id, 'success', 'Produto duplicado!');
    } catch (err) {
      console.log(err);
      notify(_id, 'error', 'Ocorreu um erro.');
    }
  }

  async function handleDeleteProduct() {
    try {
      notify(_id, 'loading', 'A eliminar produto...');
      await API({ service: 'products', resourceId: _id, operation: 'delete', method: 'DELETE' });
      router.push('/products');
      notify(_id, 'success', 'Produto eliminado!');
    } catch (err) {
      console.log(err);
      notify(_id, 'error', 'Ocorreu um erro.');
    }
  }

  return product ? (
    <PageContainer title={'Produtos › ' + product.title}>
      <Toolbar>
        <Button icon={<IoPencil />} label={'Editar'} onClick={handleEditProduct} />
        <Button icon={<IoDuplicate />} label={'Duplicar'} onClick={handleDuplicateProduct} />
        <Button
          icon={<IoTrash />}
          label={'Apagar'}
          color={'danger'}
          alert={
            <Alert
              color={'danger'}
              title={'Eliminar Produto'}
              subtitle={'Tem a certeza que pretende eliminar este produto?'}
              message={'Esta acção é irreversível e imediata.'}
              onConfirm={handleDeleteProduct}
            />
          }
        />
      </Toolbar>

      <Group title={'Informações Gerais'}>
        <Grid>
          <GridCell>
            <Label>Título</Label>
            <Value>{product.title || '-'}</Value>
          </GridCell>
          <GridCell>
            <Label>Código Único</Label>
            <Value>{product.code || '-'}</Value>
          </GridCell>
        </Grid>
      </Group>

      {product.variations.map((variation, index) => (
        <Group key={index} title={variation.title}>
          <Grid>
            <GridCell>
              <Label>Título</Label>
              <Value>{variation.title || '-'}</Value>
            </GridCell>
            <GridCell>
              <Label>Preço</Label>
              <Value>{variation.price || '-'}</Value>
            </GridCell>
          </Grid>
        </Group>
      ))}
    </PageContainer>
  ) : (
    <Loading />
  );
}
