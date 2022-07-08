import useSWR from 'swr';
import { useRouter } from 'next/router';
import notify from '../../../services/notify';
import Button from '../../../components/Button';
import Loading from '../../../components/Loading';
import PageContainer from '../../../components/PageContainer';
import Toolbar from '../../../components/Toolbar';
import { Grid } from '../../../components/Grid';
import Group from '../../../components/Group';
import { IoSave, IoClose } from 'react-icons/io5';
import API from '../../../services/API';
import { TextInput, LoadingOverlay, NumberInput } from '@mantine/core';
import Schema from '../../../schemas/CheckingAccount';
import { useForm, zodResolver } from '@mantine/form';
import { useEffect, useRef } from 'react';
import { useState } from 'react';

export default function CheckingAccount() {
  //

  const router = useRouter();
  const { _id } = router.query;

  const { data: checkingAccount, mutate } = useSWR(`/api/checking_accounts/${_id}`);

  const hasUpdatedFields = useRef(false);
  const [isLoading, setIsLoading] = useState(false);

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
      setIsLoading(true);
      notify(_id, 'loading', 'A guardar alterações...');
      await API({ service: 'checking_accounts', resourceId: _id, operation: 'edit', method: 'PUT', body: values });
      mutate({ ...checkingAccount, ...values });
      router.push(`/checking_accounts/${_id}`);
      notify(_id, 'success', 'Alterações guardadas!');
    } catch (err) {
      console.log(err);
      setIsLoading(false);
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
    <form onSubmit={form.onSubmit(handleSave)}>
      <PageContainer title={'Checking Accounts › ' + (form.values.title || 'Untitled Checking Account')}>
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
            <NumberInput
              label={'Tax Number'}
              placeholder={500100200}
              precision={0}
              maxLength={9}
              hideControls
              {...form.getInputProps('tax_number')}
            />
          </Grid>
        </Group>
      </PageContainer>
    </form>
  ) : (
    <Loading />
  );
}
