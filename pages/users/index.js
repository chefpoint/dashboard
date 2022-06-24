import useSWR from 'swr';
import { useRouter } from 'next/router';
import { styled } from '@stitches/react';
import Button from '../../components/Button';
import Table from '../../components/Table';

const PageTitle = styled('p', {
  fontSize: '30px',
  fontWeight: '$bold',
  marginBottom: '$md',
});

export default function Users() {
  //

  const router = useRouter();

  const { data: users } = useSWR('/api/users/*');

  function handleRowClick(row) {
    router.push('/users/' + row._id);
  }

  return (
    <div>
      <PageTitle>Users</PageTitle>
      <Table
        columns={[
          { label: 'Name', key: 'name' },
          { label: 'Role', key: 'role' },
        ]}
        data={users}
        onRowClick={handleRowClick}
      />
    </div>
  );
}
