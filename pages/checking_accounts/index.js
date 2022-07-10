import useSWR from 'swr';
import { useRouter } from 'next/router';
import Button from '../../components/Button';
import Table from '../../components/Table';
import PageContainer from '../../components/PageContainer';
import Toolbar from '../../components/Toolbar';
import { IoAdd } from 'react-icons/io5';

export default function CheckingAccounts() {
  //

  const router = useRouter();

  const { data: checkingAccounts } = useSWR('/api/checking_accounts/');

  function formatTableData() {
    // Transform data for table
    if (!checkingAccounts) return [];
    // Transform data for table
    const arrayOfData = [];
    checkingAccounts.forEach((ca) => {
      const formated = {
        _id: ca._id,
        title: ca.title,
        client_name: ca.client_name,
        tax_id: ca.tax_region + ca.tax_number,
      };
      arrayOfData.push(formated);
    });
    // Return array
    return arrayOfData;
  }

  function handleRowClick(row) {
    router.push(`/checking_accounts/${row._id}`);
  }

  function handleCreateCheckingAccount() {
    router.push('/checking_accounts/create');
  }

  return (
    <PageContainer title={'Checking Accounts'}>
      <Toolbar>
        <Button icon={<IoAdd />} label={'Create'} onClick={handleCreateCheckingAccount} />
      </Toolbar>

      <Table
        columns={[
          { label: 'Title', key: 'title' },
          { label: 'Client', key: 'client_name' },
          { label: 'Tax ID', key: 'tax_id' },
        ]}
        data={formatTableData()}
        onRowClick={handleRowClick}
      />
    </PageContainer>
  );
}
