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
        tax_id: c.tax_country + c.tax_number,
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
    <PageContainer title={'Clientes'}>
      <Toolbar>
        <Button icon={<IoAdd />} label={'Criar'} onClick={handleCreateCustomer} />
      </Toolbar>
      <Table
        columns={[
          { label: 'Nome', key: 'name' },
          { label: 'NIF', key: 'tax_id' },
          { label: 'Email', key: 'contact_email' },
        ]}
        data={formatTableData()}
        onRowClick={handleRowClick}
      />
    </PageContainer>
  );
}
