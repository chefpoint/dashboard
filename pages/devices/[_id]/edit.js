import useSWR from 'swr';
import { useRouter } from 'next/router';
import Button from '../../../components/Button';
import Loading from '../../../components/Loading';
import PageContainer from '../../../components/PageContainer';
import Toolbar from '../../../components/Toolbar';
import { Grid } from '../../../components/Grid';
import TextField from '../../../components/TextField';
import { IoSave, IoClose } from 'react-icons/io5';
import { useForm } from '@mantine/form';
import { useEffect, useRef } from 'react';
import AsyncSelect from 'react-select/async';
import API from '../../../services/API';
import notify from '../../../services/notify';

export default function EditDevice() {
  //

  const router = useRouter();
  const { _id } = router.query;

  const { data: device, mutate } = useSWR('/api/devices/' + _id);

  const hasUpdatedFields = useRef(false);

  function handleCancel() {
    router.push('/devices/' + _id);
  }

  async function handleSave(values) {
    try {
      notify(_id, 'loading', 'A guardar alterações...');
      await API({ service: 'devices', resourceId: _id, operation: 'edit', method: 'PUT', body: values });
      mutate({ ...device, ...values });
      router.push('/devices/' + _id);
      notify(_id, 'success', 'Alterações guardadas!');
    } catch (err) {
      console.log(err);
      notify(_id, 'error', 'Ocorreu um erro.');
    }
  }

  const form = useForm({
    initialValues: {
      title: '',
      location: { label: '', value: '' },
      layout: { label: '', value: '' },
      discounts: [{ label: '', value: '' }],
      users: [{ label: '', value: '' }],
      checking_accounts: [{ label: '', value: '' }],
    },
    validate: {
      title: (value) => (value ? null : 'Invalid Title'),
    },
  });

  useEffect(() => {
    if (!hasUpdatedFields.current && device) {
      console.log(device);
      // Format values into select options {label, value}
      let currentUsers = [];
      for (const item of device.users) currentUsers.push({ label: item.name, value: item._id });
      let currentDiscounts = [];
      for (const item of device.discounts) currentDiscounts.push({ label: item.title, value: item._id });
      let currentCheckingAccounts = [];
      for (const item of device.checking_accounts) currentCheckingAccounts.push({ label: `${item.title} (${item.client_name})`, value: item._id });

      // Set current values
      form.setValues({
        title: device.title || '',
        location: { label: device.location.title, value: device.location._id },
        layout: { label: device.layout.title, value: device.layout._id },
        users: currentUsers,
        discounts: currentDiscounts,
        checking_accounts: currentCheckingAccounts,
      });
      hasUpdatedFields.current = true;
    }
  }, [device, form]);

  const locationOptions = async (inputValue) => {
    try {
      const response = await fetch(`/api/locations/`, { method: 'GET' });
      const parsedResponse = await response.json();
      if (!response.ok) throw new Error(parsedResponse.message);
      let options = [];
      for (const item of parsedResponse) {
        options.push({ value: item._id, label: item.title });
      }
      return options.filter((i) => i.label?.toLowerCase().includes(inputValue.toLowerCase()));
    } catch (err) {
      console.log(err);
    }
  };

  const userOptions = async (inputValue) => {
    try {
      const response = await fetch(`/api/users/`, { method: 'GET' });
      const parsedResponse = await response.json();
      if (!response.ok) throw new Error(parsedResponse.message);
      let options = [];
      for (const item of parsedResponse) {
        options.push({ value: item._id, label: item.name });
      }
      return options.filter((i) => i.label?.toLowerCase().includes(inputValue.toLowerCase()));
    } catch (err) {
      console.log(err);
    }
  };

  const layoutOptions = async (inputValue) => {
    try {
      const response = await fetch(`/api/layouts/`, { method: 'GET' });
      const parsedResponse = await response.json();
      if (!response.ok) throw new Error(parsedResponse.message);
      let options = [];
      for (const item of parsedResponse) {
        options.push({ value: item._id, label: item.title });
      }
      return options.filter((i) => i.label?.toLowerCase().includes(inputValue.toLowerCase()));
    } catch (err) {
      console.log(err);
    }
  };

  const discountOptions = async (inputValue) => {
    try {
      const response = await fetch(`/api/discounts/`, { method: 'GET' });
      const parsedResponse = await response.json();
      if (!response.ok) throw new Error(parsedResponse.message);
      let options = [];
      for (const item of parsedResponse) {
        options.push({ value: item._id, label: item.title });
      }
      return options.filter((i) => i.label?.toLowerCase().includes(inputValue.toLowerCase()));
    } catch (err) {
      console.log(err);
    }
  };

  const checkingAccountOptions = async (inputValue) => {
    try {
      const response = await fetch(`/api/checking_accounts/`, { method: 'GET' });
      const parsedResponse = await response.json();
      if (!response.ok) throw new Error(parsedResponse.message);
      let options = [];
      for (const item of parsedResponse) {
        options.push({ value: item._id, label: item.title });
      }
      return options.filter((i) => i.label?.toLowerCase().includes(inputValue.toLowerCase()));
    } catch (err) {
      console.log(err);
    }
  };

  return device ? (
    <PageContainer title={'Equipamentos › ' + (form.values.title || 'Sem Título')}>
      <form onSubmit={form.onSubmit(handleSave)}>
        <Toolbar>
          <Button type={'submit'} icon={<IoSave />} label={'Guardar'} color={'success'} />
          <Button icon={<IoClose />} label={'Cancelar'} onClick={handleCancel} />
        </Toolbar>

        <Grid>
          <TextField label={'Título'} type={'text'} {...form.getInputProps('title')} />
        </Grid>

        <Grid css={{ marginTop: '$md' }}>
          <AsyncSelect {...form.getInputProps('location')} cacheOptions defaultOptions loadOptions={locationOptions} />
          <AsyncSelect {...form.getInputProps('layout')} cacheOptions defaultOptions loadOptions={layoutOptions} />
        </Grid>

        <Grid css={{ marginTop: '$md' }}>
          <AsyncSelect {...form.getInputProps('checking_accounts')} isMulti cacheOptions defaultOptions loadOptions={checkingAccountOptions} />
          <AsyncSelect {...form.getInputProps('users')} isMulti cacheOptions defaultOptions loadOptions={userOptions} />
        </Grid>

        <Grid css={{ marginTop: '$md' }}>
          <AsyncSelect {...form.getInputProps('discounts')} isMulti cacheOptions defaultOptions loadOptions={discountOptions} />
        </Grid>
      </form>
    </PageContainer>
  ) : (
    <Loading />
  );
}
