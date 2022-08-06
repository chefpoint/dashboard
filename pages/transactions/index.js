import useSWR from 'swr';
import { useRouter } from 'next/router';
import Table from '../../components/Table';
import { DateTime } from 'luxon';
import PageContainer from '../../components/PageContainer';

export default function Users() {
  //

  const router = useRouter();

  const { data: transactions } = useSWR('/api/transactions/');

  function handleRowClick(row) {
    router.push(`/transactions/${row._id}`);
  }

  function formatTableData() {
    // Transform data for table
    if (!transactions) return;
    // Sort array
    transactions.sort((a, b) => b.createdAt - a.createdAt);
    // Transform data for table
    const arrayOfData = [];
    transactions.forEach((t) => {
      //
      const formated = {
        _id: t._id,
        date_and_time: DateTime.fromISO(t.createdAt).toLocaleString({
          ...DateTime.DATE_SHORT,
          month: 'long',
          hour: 'numeric',
          minute: 'numeric',
        }),
        location: t.location?.title,
        total_amount: `${t.payment?.amount_total || '?'}€`,
      };
      // console.log(formated);
      arrayOfData.push(formated);
    });
    // Return array
    return arrayOfData;
  }

  return (
    <PageContainer title={'Transações'}>
      <Table
        columns={[
          { label: 'Date & Time', key: 'date_and_time' },
          { label: 'Location', key: 'location' },
          { label: 'Total', key: 'total_amount' },
        ]}
        data={formatTableData()}
        onRowClick={handleRowClick}
      />
    </PageContainer>
  );
}
