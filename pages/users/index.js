import useSWR from 'swr';
import { useRouter } from 'next/router';
import Button from '../../components/Button';
import Table from '../../components/Table';
import PageContainer from '../../components/PageContainer';
import Toolbar from '../../components/Toolbar';
import { IoAdd } from 'react-icons/io5';

export default function Users() {
  //

  const router = useRouter();

  const { data: users } = useSWR('/api/users/');

  function handleRowClick(row) {
    router.push(`/users/${row._id}`);
  }

  function handleCreateUser() {
    router.push('/users/create');
  }

  return (
    <PageContainer title={'Users'}>
      <Toolbar>
        <Button icon={<IoAdd />} label={'Create'} onClick={handleCreateUser} />
      </Toolbar>

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
