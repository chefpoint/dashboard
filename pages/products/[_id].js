import useSWR from 'swr';
import { useRouter } from 'next/router';
import { styled } from '@stitches/react';
import Button from '../../components/Button';
import Table from '../../components/Table';
import { toast } from 'react-toastify';
import Loading from '../../components/Loading';
import PageContainer from '../../components/PageContainer';
import Toolbar from '../../components/Toolbar';
import Group from '../../components/Group';
import Alert from '../../components/Alert';
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

export default function Product() {
  //

  const router = useRouter();
  const { _id } = router.query;

  const { data: product } = useSWR('/api/products/' + _id);

  async function handleEditProduct() {}

  async function handleDuplicateProduct() {
    try {
      // Send the request to the API
      const response = await fetch(`/api/products/${_id}/duplicate`, { method: 'GET' });
      // Parse the response to JSON
      const parsedResponse = await response.json();
      // Throw an error if the response is not OK
      if (!response.ok) throw new Error(parsedResponse.message);
      // Find the index of the updated customer in the original list...
      router.push('/devices/' + parsedResponse._id);
      toast('Wow so easy!');
    } catch (err) {
      console.log(err);
      // setErrorMessage('Ocorreu um erro inesperado.');
    }
  }

  async function handleDeleteProduct() {
    try {
      // Send the request to the API
      const response = await fetch(`/api/products/${_id}/delete`, { method: 'DELETE' });
      // Parse the response to JSON
      const parsedResponse = await response.json();
      // Throw an error if the response is not OK
      if (!response.ok) throw new Error(parsedResponse.message);
      // Find the index of the updated customer in the original list...
      router.push('/products');
    } catch (err) {
      console.log(err);
      // setErrorMessage('Ocorreu um erro inesperado.');
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
              title={'Apagar Produto'}
              subtitle={'Tem a certeza que pretende apagar este produto?'}
              message={'Esta acção é irreversível.'}
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
    </PageContainer>
  ) : (
    <Loading />
  );
}
