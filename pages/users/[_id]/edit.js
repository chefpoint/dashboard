import useSWR from 'swr';
import { useRouter } from 'next/router';
import Button from '../../../components/Button';
import Loading from '../../../components/Loading';
import PageContainer from '../../../components/PageContainer';
import Toolbar from '../../../components/Toolbar';
import Group from '../../../components/Group';
import { Grid } from '../../../components/Grid';
import { TextInput, LoadingOverlay, NumberInput } from '@mantine/core';
import { IoSave, IoClose, IoKeypad } from 'react-icons/io5';
import { useForm, yupResolver } from '@mantine/form';
import { useEffect, useRef } from 'react';
import Schema from '../../../schemas/User';
import API from '../../../services/API';
import notify from '../../../services/notify';
import { useState } from 'react';

export default function EditUser() {
  //

  const router = useRouter();
  const { _id } = router.query;

  const { data: user, mutate } = useSWR(`/api/users/${_id}`);

  const [isLoading, setIsLoading] = useState(false);
  const hasUpdatedFields = useRef(false);

  const form = useForm({
    schema: yupResolver(Schema),
    initialValues: {
      name: '',
      role: '',
      pwd: '',
    },
  });

  useEffect(() => {
    if (!hasUpdatedFields.current && user) {
      form.setValues({
        name: user.name || '',
        role: user.role || '',
        pwd: user.pwd || '',
      });
      hasUpdatedFields.current = true;
    }
  }, [user, form]);

  function handleCancel() {
    router.push(`/users/${_id}`);
  }

  async function handleSave(values) {
    try {
      setIsLoading(true);
      notify(_id, 'loading', 'Saving changes...');
      await API({ service: 'users', operation: 'edit', resourceId: _id, method: 'PUT', body: values });
      mutate({ ...user, ...values });
      router.push(`/users/${_id}`);
      notify(_id, 'success', 'Changes saved!');
    } catch (err) {
      console.log(err);
      notify(_id, 'error', 'An error occurred.');
      setIsLoading(false);
    }
  }

  return user ? (
    <form onSubmit={form.onSubmit(handleSave)}>
      <PageContainer title={'Users › ' + (form.values.name || 'Untitled User')}>
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
  ) : (
    <Loading />
  );
}
