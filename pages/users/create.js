import { useRouter } from 'next/router';
import Button from '../../components/Button';
import PageContainer from '../../components/PageContainer';
import Toolbar from '../../components/Toolbar';
import Group from '../../components/Group';
import { Grid } from '../../components/Grid';
import { IoSave, IoClose, IoKeypad } from 'react-icons/io5';
import { useForm, zodResolver } from '@mantine/form';
import { TextInput, LoadingOverlay, NumberInput } from '@mantine/core';
import Schema from '../../schemas/User';
import { useState } from 'react';
import API from '../../services/API';
import notify from '../../services/notify';

export default function CreateUser() {
  //

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    schema: zodResolver(Schema),
    initialValues: {
      name: '',
      role: '',
      pwd: '',
    },
  });

  function handleCancel() {
    router.push('/users/');
  }

  async function handleSave(values) {
    try {
      setIsLoading(true);
      notify('new', 'loading', 'Saving changes...');
      const response = await API({ service: 'users', operation: 'create', method: 'POST', body: values });
      router.push(`/users/${response._id}`);
      notify('new', 'success', 'Changes saved!');
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      notify('new', 'error', 'An error occurred.');
    }
  }

  return (
    <form onSubmit={form.onSubmit(handleSave)}>
      <PageContainer title={'Users › ' + (form.values.name || 'New User')}>
        <LoadingOverlay visible={isLoading} />
        <Toolbar>
          <Button type={'submit'} icon={<IoSave />} label={'Save'} color={'primary'} />
          <Button icon={<IoClose />} label={'Cancel'} onClick={handleCancel} />
        </Toolbar>

        <Group title={'About this User'}>
          <Grid>
            <TextInput label={'Name'} placeholder={'Alberta Soares'} {...form.getInputProps('name')} />
            <TextInput label={'Role'} placeholder={'Gerente de Cafetaria'} {...form.getInputProps('role')} />
            <NumberInput
              icon={<IoKeypad />}
              label={'Password'}
              placeholder={1234}
              precision={0}
              maxLength={4}
              hideControls
              {...form.getInputProps('pwd')}
            />
          </Grid>
        </Group>
      </PageContainer>
    </form>
  );
}
