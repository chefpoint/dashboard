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
    <PageContainer title={'Products › ' + product.title}>
      <Toolbar>
        <Button icon={<IoPencil />} label={'Edit'} onClick={handleEditProduct} />
        <Button icon={<IoDuplicate />} label={'Duplicate'} onClick={handleDuplicateProduct} />
        <Button
          icon={<IoTrash />}
          label={'Delete'}
          color={'danger'}
          alert={
            <Alert
              color={'danger'}
              title={'Delete Product'}
              subtitle={'Are you sure you want to delete this product?'}
              message={'This action is irreversible and immediate.'}
              onConfirm={handleDeleteProduct}
            />
          }
        />
      </Toolbar>

      <Group title={'About this Product'}>
        <Grid>
          <GridCell>
            <Label>Title</Label>
            <Value>{product.title || '-'}</Value>
          </GridCell>
          <GridCell>
            <Label>Short Title</Label>
            <Value>{product.short_title || '-'}</Value>
          </GridCell>
          <GridCell>
            <Label>Image Key</Label>
            <Value>{product.image || '-'}</Value>
          </GridCell>
        </Grid>
        <Grid>
          <GridCell>
            <Label>Description</Label>
            <Value>{product.description || '-'}</Value>
          </GridCell>
        </Grid>
      </Group>

      <Group title={'Product Variations'}>
        {product.variations.map((variation, index) => (
          <Group key={index}>
            <Grid>
              <GridCell>
                <Label>Variation Title</Label>
                <Value>{variation.title || '-'}</Value>
              </GridCell>
              <GridCell>
                <Label>Variation Price</Label>
                <Value>{variation.price || 'Free'}</Value>
              </GridCell>
              <GridCell>
                <Label>Tax ID</Label>
                <Value>{variation.tax_id || '-'}</Value>
              </GridCell>
            </Grid>
          </Group>
        ))}
      </Group>
    </PageContainer>
  ) : (
    <Loading />
  );
}
