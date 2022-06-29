import useSWR from 'swr';
import { useRouter } from 'next/router';
import { styled } from '@stitches/react';
import Button from '../../components/Button';
import Loading from '../../components/Loading';
import PageContainer from '../../components/PageContainer';
import Toolbar from '../../components/Toolbar';
import Group from '../../components/Group';
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

  function handleEditCheckingAccount() {}

  function handleDeleteCheckingAccount() {}

  return checkingAccount ? (
    <PageContainer title={'Contas Correntes › ' + checkingAccount.title}>
      <Toolbar>
        <Button icon={<IoPencil />} label={'Editar'} onClick={handleEditCheckingAccount} />
        <Button icon={<IoTrash />} label={'Apagar'} color={'danger'} onClick={handleDeleteCheckingAccount} />
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
