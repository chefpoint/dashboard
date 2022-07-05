import useSWR from 'swr';
import { useRouter } from 'next/router';
import { styled } from '@stitches/react';
import Button from '../../components/Button';
import Table from '../../components/Table';
import Toolbar from '../../components/Toolbar';
import PageContainer from '../../components/PageContainer';
import { IoAdd } from 'react-icons/io5';

export default function Discounts() {
  //

  const router = useRouter();

  const { data: discounts } = useSWR('/api/discounts/');

  function handleRowClick(row) {
    router.push('/discounts/' + row._id);
  }

  function handleCreateDiscount() {
    console.log();
  }

  return (
    <PageContainer title={'Descontos'}>
      <Toolbar>
        <Button icon={<IoAdd />} label={'Criar'} onClick={handleCreateDiscount} />
      </Toolbar>
      <Table
        columns={[
          { label: 'Title', key: 'title' },
          { label: 'Amount', key: 'amount' },
          { label: 'Última modificação', key: 'last_modified' },
        ]}
        data={discounts}
        onRowClick={handleRowClick}
      />
    </PageContainer>
  );
}
