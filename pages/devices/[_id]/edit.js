import useSWR from 'swr';
import { useRouter } from 'next/router';
import { styled } from '@stitches/react';
import { toast } from 'react-toastify';
import Button from '../../../components/Button';
import Loading from '../../../components/Loading';
import PageContainer from '../../../components/PageContainer';
import Toolbar from '../../../components/Toolbar';
import Group from '../../../components/Group';
import TextField from '../../../components/TextField';
import { IoSave, IoClose } from 'react-icons/io5';
import { useForm } from '@mantine/form';
import { useEffect, useRef } from 'react';
import AsyncSelect from 'react-select/async';

const Grid = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  alignItems: 'start',
  justifyContent: 'start',
  borderRadius: '$md',
  gap: '$md',
});

const GridCell = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  padding: '$md',
  borderRadius: '$md',
  backgroundColor: '$gray1',
  gap: '$xs',
  variants: {
    clickable: {
      true: {
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: '$gray4',
        },
      },
    },
  },
});

const Label = styled('p', {
  fontSize: '12px',
  fontWeight: '$medium',
  textTransform: 'uppercase',
  color: '$gray11',
});

const Value = styled('p', {
  fontSize: '18px',
  fontWeight: '$medium',
  color: '$gray12',
});

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
      // Display notification to the user
      toast.loading('A guardar alterações...', { toastId: _id });
      // Send the request to the API
      const response = await fetch(`/api/devices/${_id}/edit`, {
        method: 'PUT',
        body: JSON.stringify(values),
      });
      // Parse the response to JSON
      const parsedResponse = await response.json();
      // Throw an error if the response is not OK
      if (!response.ok) throw new Error(parsedResponse.message);
      // Revalidate the user
      mutate({ ...device, ...values });
      // Find the index of the updated customer in the original list...
      router.push('/devices/' + _id);
      // Update notification
      toast.update(_id, { render: 'Alterações guardadas!', type: 'success', isLoading: false, autoClose: true });
    } catch (err) {
      console.log(err);
      toast.update(_id, { render: 'Error', type: 'error', isLoading: false });
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
