import { useRouter } from 'next/router';
import API from '../../services/API';
import notify from '../../services/notify';
import Button from '../../components/Button';
import PageContainer from '../../components/PageContainer';
import Toolbar from '../../components/Toolbar';
import { Grid } from '../../components/Grid';
import TextField from '../../components/TextField';
import { IoSave, IoClose } from 'react-icons/io5';
import { useForm } from '@mantine/form';

export default function CheckingAccount() {
  //

  const router = useRouter();

  function handleCancel() {
    router.push('/checking_accounts/');
  }

  async function handleSave(values) {
    try {
      notify('new', 'loading', 'A guardar alterações...');
      // Send the request to the API
      const response = await API({ service: 'checking_accounts', operation: 'create', method: 'POST', body: values });
      // Find the index of the updated customer in the original list...
      router.push('/checking_accounts/' + response._id);
      // Display notification to the user
      notify('new', 'success', 'Alterações guardadas!');
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

  return (
    <PageContainer title={'Contas Correntes › ' + (form.values.title || 'Nova Conta')}>
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
  );
}
