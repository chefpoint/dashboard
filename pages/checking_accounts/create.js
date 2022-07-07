import { useRouter } from 'next/router';
import API from '../../services/API';
import notify from '../../services/notify';
import Button from '../../components/Button';
import PageContainer from '../../components/PageContainer';
import Toolbar from '../../components/Toolbar';
import { Grid } from '../../components/Grid';
import TextField from '../../components/TextField';
import { IoSave, IoClose } from 'react-icons/io5';
import { useForm, zodResolver } from '@mantine/form';
import Schema from '../../schemas/CheckingAccount';

export default function CheckingAccount() {
  //

  const router = useRouter();

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
    router.push('/checking_accounts/');
  }

  async function handleSave(values) {
    try {
      notify('new', 'loading', 'A guardar alterações...');
      const response = await API({ service: 'checking_accounts', operation: 'create', method: 'POST', body: values });
      router.push(`/checking_accounts/${response._id}`);
      notify('new', 'success', 'Alterações guardadas!');
    } catch (err) {
      console.log(err);
      notify('new', 'error', 'Ocorreu um erro. As alterações não foram guardadas.');
    }
  }

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
          <TextField label={'Tax Region'} type={'text'} {...form.getInputProps('tax_region')} />
          <TextField label={'Tax Number'} type={'number'} {...form.getInputProps('tax_number')} />
        </Grid>
      </form>
    </PageContainer>
  );
}
