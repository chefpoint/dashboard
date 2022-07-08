import { useRouter } from 'next/router';
import Button from '../../../components/Button';
import PageContainer from '../../../components/PageContainer';
import Toolbar from '../../../components/Toolbar';
import Group from '../../../components/Group';
import { Grid } from '../../../components/Grid';
import { IoSave, IoClose, IoKeypad } from 'react-icons/io5';
import { formList, useForm, zodResolver } from '@mantine/form';
import { TextInput, LoadingOverlay, NumberInput, Switch } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import Schema from '../../../schemas/Customer';
import { useState, useRef, useEffect } from 'react';
import API from '../../../services/API';
import notify from '../../../services/notify';
import useSWR from 'swr';

export default function CreateCustomer() {
  //

  const router = useRouter();
  const { _id } = router.query;

  const { data: customer, mutate } = useSWR(`/api/customers/${_id}`);

  const hasUpdatedFields = useRef(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    schema: zodResolver(Schema),
    initialValues: {
      first_name: '',
      last_name: '',
      tax_region: '',
      tax_number: '',
      contact_email: '',
      send_invoices: false,
      reference: '',
      birthday: '',
    },
  });

  useEffect(() => {
    if (!hasUpdatedFields.current && customer) {
      console.log(customer);
      // form.setValues(Schema.parse(customer));
      form.setValues({
        first_name: customer.first_name || '',
        last_name: customer.last_name || '',
        tax_region: customer.tax_region || '',
        tax_number: Number(customer.tax_number) || '',
        contact_email: customer.contact_email || '',
        send_invoices: customer.send_invoices,
        reference: customer.reference || '',
        birthday: customer.birthday || '',
      });
      hasUpdatedFields.current = true;
    }
  }, [customer, form]);

  function handleCancel() {
    router.push(`/customers/${_id}`);
  }

  async function handleSave(values) {
    try {
      setIsLoading(true);
      notify('new', 'loading', 'Saving changes...');
      await API({ service: 'customers', resourceId: _id, operation: 'edit', method: 'PUT', body: values });
      mutate({ ...customer, ...values });
      router.push(`/customers/${_id}`);
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
            <Switch
              label='Send Invoices'
              checked={form.values.send_invoices}
              onChange={({ currentTarget }) => form.setFieldValue('send_invoices', currentTarget.checked)}
            />
            <TextInput label={'Reference'} placeholder={'PT'} {...form.getInputProps('reference')} />
            <DatePicker placeholder={'Pick a date'} label={'Birthday'} {...form.getInputProps('birthday')} />
          </Grid>
        </Group>
      </PageContainer>
    </form>
  );
}
