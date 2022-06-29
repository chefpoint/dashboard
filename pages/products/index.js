import useSWR from 'swr';
import { useRouter } from 'next/router';
import { styled } from '@stitches/react';
import Button from '../../components/Button';
import Table from '../../components/Table';
import PageContainer from '../../components/PageContainer';

export default function Products() {
  //

  const router = useRouter();

  const { data: products } = useSWR('/api/products/');

  function handleRowClick(row) {
    router.push('/products/' + row._id);
  }

  return (
    <PageContainer title={'Produtos'}>
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
