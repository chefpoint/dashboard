import useSWR from 'swr';
import { useRouter } from 'next/router';
import { styled } from '@stitches/react';
import { toast } from 'react-toastify';
import Button from '../../../components/Button';
import Loading from '../../../components/Loading';
import PageContainer from '../../../components/PageContainer';
import Toolbar from '../../../components/Toolbar';
import Group from '../../../components/Group';
import { IoPencil, IoTrash } from 'react-icons/io5';

const Grid = styled('div', {
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

export default function CheckingAccount() {
  //

  const router = useRouter();
  const { _id } = router.query;

  const { data: checkingAccount } = useSWR('/api/checking_accounts/' + _id);

  function handleEditCheckingAccount() {
    router.push(router.asPath + '/edit');
  }

  async function handleDeleteCheckingAccount() {
    try {
      // Display notification to the user
      toast.loading('Por favor aguarde...', { toastId: _id });
      // Send the request to the API
      const response = await fetch(`/api/checking_accounts/${_id}/delete`, { method: 'DELETE' });
      // Parse the response to JSON
      const parsedResponse = await response.json();
      // Throw an error if the response is not OK
      if (!response.ok) throw new Error(parsedResponse.message);
      // Find the index of the updated customer in the original list...
      router.push('/checking_accounts');
      // Update notification
      toast.update(_id, { render: 'Conta Corrente apagada!', type: 'success', isLoading: false, autoClose: true });
    } catch (err) {
      console.log(err);
      toast.update(_id, { render: 'Ocorreu um erro inesperado.', type: 'error', isLoading: false });
    }
  }

  return checkingAccount ? (
    <PageContainer title={'Contas Correntes › ' + checkingAccount.title}>
      <Toolbar>
        <Button icon={<IoPencil />} label={'Editar'} onClick={handleEditCheckingAccount} />
        <Button icon={<IoTrash />} label={'Eliminar'} color={'danger'} onClick={handleDeleteCheckingAccount} />
      </Toolbar>

      <Group title={'Informações Gerais'}>
        <Grid>
          <GridCell>
            <Label>Título</Label>
            <Value>{checkingAccount.title || '-'}</Value>
          </GridCell>
          <GridCell>
            <Label>Cliente</Label>
            <Value>{checkingAccount.client_name || '-'}</Value>
          </GridCell>
          <GridCell>
            <Label>NIF</Label>
            <Value>{checkingAccount.tax_country + checkingAccount.tax_number || '-'}</Value>
          </GridCell>
        </Grid>
      </Group>
    </PageContainer>
  ) : (
    <Loading />
  );
}
