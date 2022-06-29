import useSWR from 'swr';
import { useRouter } from 'next/router';
import { styled } from '@stitches/react';
import Button from '../../components/Button';
import Table from '../../components/Table';
import PageContainer from '../../components/PageContainer';

export default function Users() {
  //

  const router = useRouter();

  const { data: users } = useSWR('/api/users/');

  function handleRowClick(row) {
    router.push('/users/' + row._id);
  }

  return (
    <PageContainer title={'Colaboradores'}>
      <Table
        columns={[
          { label: 'Name', key: 'name' },
          { label: 'Role', key: 'role' },
        ]}
        data={users}
        onRowClick={handleRowClick}
      />
    </PageContainer>
  );
}
