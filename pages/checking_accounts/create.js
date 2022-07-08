import { useRouter } from 'next/router';
import API from '../../services/API';
import notify from '../../services/notify';
import Button from '../../components/Button';
import PageContainer from '../../components/PageContainer';
import Toolbar from '../../components/Toolbar';
import { Grid } from '../../components/Grid';
import Group from '../../components/Group';
import { IoSave, IoClose } from 'react-icons/io5';
import { TextInput, LoadingOverlay } from '@mantine/core';
import { useForm, yupResolver } from '@mantine/form';
import Schema from '../../schemas/CheckingAccount';
import { useState } from 'react';

export default function CheckingAccount() {
  //

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    schema: yupResolver(Schema),
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
      setIsLoading(true);
      notify('new', 'loading', 'A guardar alterações...');
      const response = await API({ service: 'checking_accounts', operation: 'create', method: 'POST', body: values });
      router.push(`/checking_accounts/${response._id}`);
      notify('new', 'success', 'Alterações guardadas!');
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      notify('new', 'error', 'Ocorreu um erro. As alterações não foram guardadas.');
    }
  }

  return (
    <form onSubmit={form.onSubmit(handleSave)}>
      <PageContainer title={'Checking Accounts › ' + (form.values.title || 'New Checking Account')}>
        <LoadingOverlay visible={isLoading} />
        <Toolbar>
          <Button type={'submit'} icon={<IoSave />} label={'Save'} color={'primary'} />
          <Button icon={<IoClose />} label={'Cancel'} onClick={handleCancel} />
        </Toolbar>

        <Group title={'General Details'}>
          <Grid>
            <TextInput label={'Title'} placeholder={'Board of Directors'} {...form.getInputProps('title')} />
            <TextInput label={'Client Name'} placeholder={'Fidelidade'} {...form.getInputProps('client_name')} />
            <TextInput label={'Tax Region'} placeholder={'PT'} maxLength={2} {...form.getInputProps('tax_region')} />
            <TextInput
              label={'Tax Number'}
              placeholder={'500 100 200'}
              maxLength={11}
              {...form.getInputProps('tax_number')}
            />
          </Grid>
        </Group>
      </PageContainer>
    </form>
  );
}
