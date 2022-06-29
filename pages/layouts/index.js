import useSWR from 'swr';
import { useRouter } from 'next/router';
import { styled } from '@stitches/react';
import Button from '../../components/Button';
import Table from '../../components/Table';
import PageContainer from '../../components/PageContainer';

export default function Layouts() {
  //

  const router = useRouter();

  const { data: layouts } = useSWR('/api/layouts/');

  function handleRowClick(row) {
    router.push('/layouts/' + row._id);
  }

  return (
    <PageContainer title={'Layouts'}>
      <Table
        columns={[
          { label: 'Title', key: 'title' },
          { label: 'Última modificação', key: 'last_modified' },
        ]}
        data={layouts}
        onRowClick={handleRowClick}
      />
    </PageContainer>
  );
}
