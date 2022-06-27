import useSWR from 'swr';
import { useRouter } from 'next/router';
import { styled } from '@stitches/react';
import Button from '../../components/Button';
import Table from '../../components/Table';
import PageContainer from '../../components/PageContainer';

export default function Devices() {
  //

  const router = useRouter();

  const { data: devices } = useSWR('/api/devices/');

  console.log(devices);

  function handleRowClick(row) {
    router.push('/devices/' + row._id);
  }

  return (
    <PageContainer title={'Equipamentos'}>
      <Table
        columns={[
          { label: 'Title', key: 'title' },
          { label: 'Code', key: 'code' },
        ]}
        data={devices}
        onRowClick={handleRowClick}
      />
    </PageContainer>
  );
}
