import useSWR from 'swr';
import { useRouter } from 'next/router';
import { styled } from '@stitches/react';
import Button from '../../components/Button';
import Table from '../../components/Table';
import PageContainer from '../../components/PageContainer';
import Toolbar from '../../components/Toolbar';
import { IoAdd } from 'react-icons/io5';

export default function Customers() {
  //

  const router = useRouter();

  const { data: customers } = useSWR('/api/customers/');

  function formatTableData() {
    // Transform data for table
    if (!customers) return;
    // Transform data for table
    const arrayOfData = [];
    customers.forEach((c) => {
      //
      const formated = {
        _id: c._id,
        name: c.first_name + c.last_name,
        tax_id: c.tax_region + c.tax_number,
        contact_email: c.contact_email,
      };
      // console.log(formated);
      arrayOfData.push(formated);
    });
    // Return array
    return arrayOfData;
  }

  function handleRowClick(row) {
    router.push('/customers/' + row._id);
  }

  function handleCreateCustomer() {
    router.push('/customers/create');
  }

  return (
    <PageContainer title={'Customers'}>
      <Toolbar>
        <Button icon={<IoAdd />} label={'Create'} onClick={handleCreateCustomer} />
      </Toolbar>
      <Table
        columns={[
          { label: 'Name', key: 'name' },
          { label: 'Tax ID', key: 'tax_id' },
          { label: 'Contact Email', key: 'contact_email' },
        ]}
        data={formatTableData()}
        onRowClick={handleRowClick}
      />
    </PageContainer>
  );
}
