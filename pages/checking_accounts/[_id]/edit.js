import useSWR from 'swr';
import { useRouter } from 'next/router';
import { styled } from '@stitches/react';
import notify from '../../../services/notify';
import Button from '../../../components/Button';
import Loading from '../../../components/Loading';
import PageContainer from '../../../components/PageContainer';
import Toolbar from '../../../components/Toolbar';
import { Grid } from '../../../components/Grid';
import TextField from '../../../components/TextField';
import { IoSave, IoClose } from 'react-icons/io5';
import API from '../../../services/API';
import { useForm } from '@mantine/form';
import { useEffect, useRef } from 'react';

export default function CheckingAccount() {
  //

  const router = useRouter();
  const { _id } = router.query;

  const { data: checkingAccount, mutate } = useSWR('/api/checking_accounts/' + _id);

  const hasUpdatedFields = useRef(false);

  function handleCancel() {
    router.push('/checking_accounts/' + _id);
  }

  async function handleSave(values) {
    try {
      // Display notification to the user
      notify(_id, 'loading', 'A guardar alterações...');
      // Send the request to the API
      await API({ service: 'checking_accounts', resourceId: _id, operation: 'edit', method: 'PUT', body: values });
      // Revalidate the user
      mutate({ ...checkingAccount, ...values });
      // Get out of edit mode
      router.push('/checking_accounts/' + _id);
      // Update notification
      notify(_id, 'success', 'Alterações guardadas!');
    } catch (err) {
      console.log(err);
      notify(_id, 'error', 'Ocorreu um erro. As alterações não foram guardadas.');
    }
  }

  const form = useForm({
    initialValues: {
      title: '',
      client_name: '',
    },
    validate: {
      title: (value) => (value ? null : 'Invalid Title'),
      client_name: (value) => (value ? null : 'Invalid Title'),
    },
  });

  useEffect(() => {
    if (!hasUpdatedFields.current && checkingAccount) {
      form.setValues({
        title: checkingAccount.title || '',
        client_name: checkingAccount.client_name || '',
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
        </Grid>
      </form>
    </PageContainer>
  ) : (
    <Loading />
  );
}
