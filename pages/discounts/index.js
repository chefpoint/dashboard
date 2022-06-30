import useSWR from 'swr';
import { useRouter } from 'next/router';
import { styled } from '@stitches/react';
import Button from '../../components/Button';
import Table from '../../components/Table';
import PageContainer from '../../components/PageContainer';

export default function Discounts() {
  //

  const router = useRouter();

  const { data: discounts } = useSWR('/api/discounts/');

  function handleRowClick(row) {
    router.push('/discounts/' + row._id);
  }

  return (
    <PageContainer title={'Descontos'}>
      <Table
        columns={[
          { label: 'Title', key: 'title' },
          { label: 'Última modificação', key: 'last_modified' },
        ]}
        data={discounts}
        onRowClick={handleRowClick}
      />
    </PageContainer>
  );
}
