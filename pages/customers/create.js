import { useRouter } from 'next/router';
import Button from '../../components/Button';
import PageContainer from '../../components/PageContainer';
import Toolbar from '../../components/Toolbar';
import Group from '../../components/Group';
import { Grid } from '../../components/Grid';
import { IoSave, IoClose, IoKeypad } from 'react-icons/io5';
import { useForm, zodResolver } from '@mantine/form';
import { TextInput, LoadingOverlay, NumberInput, Switch } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import Schema from '../../schemas/Customer';
import { useState } from 'react';
import API from '../../services/API';
import notify from '../../services/notify';

export default function CreateCustomer() {
  //

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    schema: zodResolver(Schema),
    initialValues: {
      first_name: '',
      last_name: '',
      tax_region: '',
      tax_number: '',
      contact_email: '',
      send_invoices: '',
      reference: '',
      birthday: '',
    },
  });

  function handleCancel() {
    router.push('/customers/');
  }

  async function handleSave(values) {
    try {
      setIsLoading(true);
      notify('new', 'loading', 'Saving changes...');
      const response = await API({ service: 'customers', operation: 'create', method: 'POST', body: values });
      router.push(`/customers/${response._id}`);
      notify('new', 'success', 'Changes saved!');
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      notify('new', 'error', 'An error occurred.');
    }
  }

  return (
    <form onSubmit={form.onSubmit(handleSave)}>
      <PageContainer
        title={
          'Customers › ' +
          (form.values.first_name || form.values.last_name
            ? `${form.values.first_name} ${form.values.last_name}`
            : 'New Customer')
        }
      >
        <LoadingOverlay visible={isLoading} />
        <Toolbar>
          <Button type={'submit'} icon={<IoSave />} label={'Save'} color={'primary'} />
          <Button icon={<IoClose />} label={'Cancel'} onClick={handleCancel} />
        </Toolbar>

        <Group title={'About this Customer'}>
          <Grid>
            <TextInput label={'First Name'} placeholder={'Alberta'} {...form.getInputProps('first_name')} />
            <TextInput label={'Last Name'} placeholder={'Soares'} {...form.getInputProps('last_name')} />
            <TextInput label={'Tax Region'} placeholder={'PT'} maxLength={2} {...form.getInputProps('tax_region')} />
            <NumberInput
              label={'Tax Number'}
              placeholder={500100200}
              precision={0}
              maxLength={9}
              hideControls
              {...form.getInputProps('tax_number')}
            />
            <TextInput
              label={'Contact Email'}
              placeholder={'email@icloud.com'}
              {...form.getInputProps('contact_email')}
            />
            <Switch label='Send Invoices' {...form.getInputProps('send_invoices')} />
            <TextInput label={'Reference'} placeholder={'PT'} {...form.getInputProps('reference')} />
            <DatePicker placeholder={'Pick a date'} label={'Birthday'} {...form.getInputProps('birthday')} />
          </Grid>
        </Group>
      </PageContainer>
    </form>
  );
}
