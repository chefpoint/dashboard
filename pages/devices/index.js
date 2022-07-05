import useSWR from 'swr';
import { useRouter } from 'next/router';
import { styled } from '@stitches/react';
import Button from '../../components/Button';
import Table from '../../components/Table';
import Toolbar from '../../components/Toolbar';
import { IoAdd } from 'react-icons/io5';
import PageContainer from '../../components/PageContainer';

export default function Devices() {
  //

  const router = useRouter();

  const { data: devices } = useSWR('/api/devices/');

  function handleRowClick(row) {
    router.push('/devices/' + row._id);
  }

  function handleCreateDevice() {
    router.push('/devices/create');
  }

  return (
    <PageContainer title={'Equipamentos'}>
      <Toolbar>
        <Button icon={<IoAdd />} label={'Criar'} onClick={handleCreateDevice} />
      </Toolbar>
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
