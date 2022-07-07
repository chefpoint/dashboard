import useSWR from 'swr';
import { useRouter } from 'next/router';
import notify from '../../../services/notify';
import Button from '../../../components/Button';
import Loading from '../../../components/Loading';
import PageContainer from '../../../components/PageContainer';
import Toolbar from '../../../components/Toolbar';
import { Grid } from '../../../components/Grid';
import TextField from '../../../components/TextField';
import { IoSave, IoClose } from 'react-icons/io5';
import API from '../../../services/API';
import Schema from '../../../schemas/CheckingAccount';
import { useForm, zodResolver } from '@mantine/form';
import { useEffect, useRef } from 'react';

export default function CheckingAccount() {
  //

  const router = useRouter();
  const { _id } = router.query;

  const { data: checkingAccount, mutate } = useSWR(`/api/checking_accounts/${_id}`);

  const hasUpdatedFields = useRef(false);

  const form = useForm({
    schema: zodResolver(Schema),
    initialValues: {
      title: '',
      client_name: '',
      tax_region: '',
      tax_number: '',
    },
  });

  function handleCancel() {
    router.push(`/checking_accounts/${_id}`);
  }

  async function handleSave(values) {
    try {
      notify(_id, 'loading', 'A guardar alterações...');
      await API({ service: 'checking_accounts', resourceId: _id, operation: 'edit', method: 'PUT', body: values });
      mutate({ ...checkingAccount, ...values });
      router.push(`/checking_accounts/${_id}`);
      notify(_id, 'success', 'Alterações guardadas!');
    } catch (err) {
      console.log(err);
      notify(_id, 'error', 'Ocorreu um erro.');
    }
  }

  useEffect(() => {
    if (!hasUpdatedFields.current && checkingAccount) {
      form.setValues({
        title: checkingAccount.title || '',
        client_name: checkingAccount.client_name || '',
        tax_region: checkingAccount.tax_region || '',
        tax_number: checkingAccount.tax_number || '',
      });
      hasUpdatedFields.current = true;
    }
  }, [checkingAccount, form]);

  return checkingAccount ? (
    <PageContainer title={'Contas Correntes › ' + (form.values.title || 'Sem Título')}>
      <form onSubmit={form.onSubmit(handleSave)}>
        <Toolbar>
          <Button type={'submit'} icon={<IoSave />} label={'Guardar'} color={'success'} />
          <Button icon={<IoClose />} label={'Cancelar'} onClick={handleCancel} />
        </Toolbar>

        <Grid>
          <TextField label={'Título'} type={'text'} {...form.getInputProps('title')} />
          <TextField label={'Cliente'} type={'text'} {...form.getInputProps('client_name')} />
          <TextField label={'Tax Region'} type={'text'} {...form.getInputProps('tax_region')} />
          <TextField label={'Tax Number'} type={'number'} {...form.getInputProps('tax_number')} />
        </Grid>
      </form>
    </PageContainer>
  ) : (
    <Loading />
  );
}
