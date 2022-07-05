import useSWR from 'swr';
import { useRouter } from 'next/router';
import { styled } from '@stitches/react';
import Button from '../../components/Button';
import Table from '../../components/Table';
import Toolbar from '../../components/Toolbar';
import { IoAdd } from 'react-icons/io5';
import PageContainer from '../../components/PageContainer';

export default function Locations() {
  //

  const router = useRouter();

  const { data: locations } = useSWR('/api/locations/');

  function handleRowClick(row) {
    router.push('/locations/' + row._id);
  }

  function handleCreateLocation() {
    router.push('/locations/create');
  }

  return (
    <PageContainer title={'Locais'}>
      <Toolbar>
        <Button icon={<IoAdd />} label={'Criar'} onClick={handleCreateLocation} />
      </Toolbar>
      <Table
        columns={[
          { label: 'Title', key: 'title' },
          { label: 'Última modificação', key: 'last_modified' },
        ]}
        data={locations}
        onRowClick={handleRowClick}
      />
    </PageContainer>
  );
}
