import useSWR from 'swr';
import { DateTime } from 'luxon';
import { useRouter } from 'next/router';
import Button from '../../components/Button';
import Toolbar from '../../components/Toolbar';
import Table from '../../components/Table';
import Loading from '../../components/Loading';
import PageContainer from '../../components/PageContainer';
import Group from '../../components/Group';
import { Grid, GridCell, Label, Value } from '../../components/Grid';

export default function Users() {
  //

  const router = useRouter();
  const { _id } = router.query;

  const { data: transaction } = useSWR(`/api/transactions/${_id}`);

  function handleOpenInvoice() {
    window.open(`/api/transactions/${transaction._id}/invoice`, '_blank');
  }

  function handleOpenCustomer() {
    router.push(`/customers/${transaction.customer._id}`);
  }

  function handleOpenUser() {
    router.push(`/users/${transaction.user._id}`);
  }

  function handleOpenDevice() {
    router.push(`/devices/${transaction.device._id}`);
  }

  function handleOpenLayout() {
    router.push(`/layouts/${transaction.layout._id}`);
  }

  function handleOpenProduct(product) {
    router.push(`/products/${product.product_id}`);
  }

  function formatTableData() {
    // Transform data for table
    const arrayOfData = [];
    transaction.items.forEach((i) => {
      arrayOfData.push({
        variation_id: i.variation_id,
        product_id: i.product_id,
        product_variation_title: i.product_title + ' - ' + i.variation_title,
        qty_price: i.qty + ' x ' + i.price + '€',
        line_total: `${i.line_total}€ (${i.tax_percentage * 100}% IVA)`,
      });
    });
    // Return array
    return arrayOfData;
  }

  return transaction ? (
    <PageContainer title={'Transações › Detalhe'}>
      <Toolbar>
        {transaction.customer && <Button onClick={handleOpenCustomer}>Abrir Cliente</Button>}
        {transaction.invoice && <Button onClick={handleOpenInvoice}>Abrir Fatura</Button>}
      </Toolbar>

      <Group title={'Informações Gerais'}>
        <Grid>
          <GridCell>
            <Label>Data e Hora</Label>
            <Value>
              {DateTime.fromISO(transaction.createdAt).toLocaleString({
                ...DateTime.DATE_SHORT,
                month: 'long',
                hour: 'numeric',
                minute: 'numeric',
              })}
            </Value>
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
              <Value>{transaction.customer.tax_region + transaction.customer.tax_number}</Value>
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
            <Value>{transaction.payment.amount_total + '€'}</Value>
          </GridCell>
          <GridCell>
            <Label>Método Utilizado</Label>
            <Value>{transaction.payment.method_label}</Value>
          </GridCell>
          {transaction.invoice && (
            <GridCell clickable onClick={handleOpenInvoice}>
              <Label>Documento</Label>
              <Value>{transaction.invoice.number}</Value>
            </GridCell>
          )}
          <GridCell clickable onClick={handleOpenUser}>
            <Label>Atendido por</Label>
            <Value>{transaction.user.name}</Value>
          </GridCell>
        </Grid>
      </Group>

      <Table
        columns={[
          { label: 'Produto', key: 'product_variation_title' },
          { label: 'Qtd. x Preço', key: 'qty_price' },
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
