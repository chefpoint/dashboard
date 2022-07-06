import useSWR from 'swr';
import { useRouter } from 'next/router';
import Button from '../../components/Button';
import Table from '../../components/Table';
import PageContainer from '../../components/PageContainer';
import Toolbar from '../../components/Toolbar';
import { IoAdd } from 'react-icons/io5';

export default function Products() {
  //

  const router = useRouter();

  const { data: products } = useSWR('/api/products/');

  function handleRowClick(row) {
    router.push(`/products/${row._id}`);
  }

  function handleCreateProduct() {
    router.push('/products/create');
  }

  return (
    <PageContainer title={'Produtos'}>
      <Toolbar>
        <Button icon={<IoAdd />} label={'Criar'} onClick={handleCreateProduct} />
      </Toolbar>
      <Table
        columns={[
          { label: 'Title', key: 'title' },
          { label: 'Última modificação', key: 'last_modified' },
        ]}
        data={products}
        onRowClick={handleRowClick}
      />
    </PageContainer>
  );
}
