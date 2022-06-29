import useSWR from 'swr';
import { DateTime } from 'luxon';
import { useRouter } from 'next/router';
import { styled } from '@stitches/react';
import Button from '../../components/Button';
import Toolbar from '../../components/Toolbar';
import Table from '../../components/Table';
import Loading from '../../components/Loading';
import PageContainer from '../../components/PageContainer';
import Group from '../../components/Group';

export const Grid = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  borderRadius: '$md',
  gap: '$md',
});

const GridCell = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  padding: '$md',
  borderRadius: '$md',
  backgroundColor: '$gray1',
  gap: '$xs',
  variants: {
    clickable: {
      true: {
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: '$gray4',
        },
      },
    },
  },
});

const Label = styled('p', {
  fontSize: '12px',
  fontWeight: '$medium',
  textTransform: 'uppercase',
  color: '$gray11',
});

const Value = styled('p', {
  fontSize: '18px',
  fontWeight: '$medium',
  color: '$gray12',
});

const ProductInfo = styled(GridCell, {
  flexDirection: 'row',
  gap: '$md',
  alignItems: 'baseline',
});

const ProductTitle = styled(Value, {});

const ProductPrice = styled(Value, {
  fontSize: '15px',
  color: '$primary5',
});

export default function Users() {
  //

  const router = useRouter();
  const { _id } = router.query;

  const { data: transaction } = useSWR('/api/transactions/' + _id);

  console.log(transaction && transaction.items);

  function handleOpenInvoice() {
    window.open('/api/transactions/' + transaction._id + '/invoice', '_blank');
  }

  function handleOpenCustomer() {
    router.push('/customers/' + transaction.customer.customer_id);
  }

  function handleOpenUser() {
    router.push('/users/' + transaction.user.user_id);
  }

  function handleOpenDevice() {
    console.log(transaction);
  }

  function handleOpenLayout() {
    console.log(transaction);
  }

  function handleOpenProduct(product) {
    console.log(product.product_id);
  }

  function formatTableData() {
    // Transform data for table
    const arrayOfData = [];
    transaction.items.forEach((i) => {
      //
      const formated = {
        variation_id: i.variation_id,
        product_id: i.product_id,
        product_variation_title: i.product_title + ' - ' + i.variation_title,
        qty_price: i.qty + ' x ' + i.price + '€',
        line_total: i.qty * i.price + '€' + ' (' + i.vat_percentage * 100 + '% IVA)',
      };
      // console.log(formated);
      arrayOfData.push(formated);
    });
    // Return array
    return arrayOfData;
  }

  return transaction ? (
    <PageContainer title={'Transações › Detalhe'}>
      <Toolbar>
        {transaction.customer && <Button onClick={handleOpenCustomer}>Abrir Cliente</Button>}
        <Button onClick={handleOpenInvoice}>Abrir Fatura</Button>
      </Toolbar>

      <Group title={'Informações Gerais'}>
        <Grid>
          <GridCell>
            <Label>Data e Hora</Label>
            <Value>{DateTime.fromISO(transaction.timestamp).toFormat('yyyy-mm-dd HH:mm')}</Value>
          </GridCell>
          <GridCell>
            <Label>Local</Label>
            <Value>{transaction.location.title}</Value>
          </GridCell>
          <GridCell clickable onClick={handleOpenDevice}>
            <Label>Equipamento</Label>
            <Value>{transaction.device.title}</Value>
          </GridCell>
          <GridCell clickable onClick={handleOpenLayout}>
            <Label>Layout</Label>
            <Value>{transaction.layout.title}</Value>
          </GridCell>
        </Grid>
      </Group>

      {transaction.customer && (
        <Group title={'Cliente'}>
          <Grid>
            <GridCell clickable onClick={handleOpenCustomer}>
              <Label>Nome</Label>
              <Value>{transaction.customer.first_name + ' ' + transaction.customer.last_name}</Value>
            </GridCell>
            <GridCell>
              <Label>NIF</Label>
              <Value>{transaction.customer.tax_country + transaction.customer.tax_number}</Value>
            </GridCell>
            <GridCell>
              <Label>Email</Label>
              <Value>{transaction.customer.contact_email || '-'}</Value>
            </GridCell>
          </Grid>
        </Group>
      )}

      <Group title={'Dados de Pagamento'}>
        <Grid>
          <GridCell>
            <Label>Valor Total</Label>
            <Value>{transaction.payment.total_amount + '€'}</Value>
          </GridCell>
          <GridCell>
            <Label>Método Utilizado</Label>
            <Value>{transaction.payment.method_label}</Value>
          </GridCell>
          <GridCell clickable onClick={handleOpenInvoice}>
            <Label>Documento</Label>
            <Value>{transaction.invoice.number}</Value>
          </GridCell>
          <GridCell clickable onClick={handleOpenUser}>
            <Label>Atendido por</Label>
            <Value>{transaction.user.name}</Value>
          </GridCell>
        </Grid>
      </Group>

      <Table
        columns={[
          { label: 'Produto', key: 'product_variation_title' },
          { label: 'Quantidade x Preço', key: 'qty_price' },
          { label: 'Total de Linha', key: 'line_total' },
        ]}
        data={formatTableData()}
        onRowClick={handleOpenProduct}
      />
    </PageContainer>
  ) : (
    <Loading />
  );
}
