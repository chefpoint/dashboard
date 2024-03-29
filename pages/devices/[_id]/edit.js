import useSWR from 'swr';
import { useRouter } from 'next/router';
import Button from '../../../components/Button';
import Loading from '../../../components/Loading';
import PageContainer from '../../../components/PageContainer';
import Toolbar from '../../../components/Toolbar';
import { Grid, GridCell, Label, Value } from '../../../components/Grid';
import Group from '../../../components/Group';
import { IoSave, IoClose } from 'react-icons/io5';
import { useForm, zodResolver } from '@mantine/form';
import { TextInput, LoadingOverlay, Select, MultiSelect } from '@mantine/core';
import Schema from '../../../schemas/Device';
import { useEffect, useRef } from 'react';
import { useState } from 'react';
import API from '../../../services/API';
import notify from '../../../services/notify';

export default function EditDevice() {
  //

  const router = useRouter();
  const { _id } = router.query;

  const { data: device, mutate } = useSWR(`/api/devices/${_id}`);
  const { data: locations } = useSWR('/api/locations');
  const { data: users } = useSWR('/api/users');
  const { data: discounts } = useSWR('/api/discounts');
  const { data: layouts } = useSWR('/api/layouts');
  const { data: checkingAccounts } = useSWR('/api/checking_accounts');

  const hasUpdatedFields = useRef(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    schema: zodResolver(Schema),
    initialValues: {
      title: '',
      location: '',
      users: [],
      layout: '',
      discounts: [],
      checking_accounts: [],
    },
  });

  useEffect(() => {
    if (!hasUpdatedFields.current && device) {
      //
      const formattedDeviceUsers = [];
      for (const item of device.users) formattedDeviceUsers.push(item._id);

      const formattedDeviceDiscounts = [];
      for (const item of device.discounts) formattedDeviceDiscounts.push(item._id);

      const formattedDeviceCheckingAccounts = [];
      for (const item of device.checking_accounts) formattedDeviceCheckingAccounts.push(item._id);

      form.setValues({
        title: device.title || '',
        location: device.location._id,
        layout: device.layout._id,
        users: formattedDeviceUsers,
        discounts: formattedDeviceDiscounts,
        checking_accounts: formattedDeviceCheckingAccounts,
      });

      hasUpdatedFields.current = true;
    }
  }, [device, form]);

  function formatSelectData(data = [], labelKey = 'title', valueKey = '_id') {
    const formatted = [];
    for (const item of data) formatted.push({ value: item[valueKey], label: item[labelKey] });
    return formatted;
  }

  function handleCancel() {
    router.push('/devices/' + _id);
  }

  async function handleSave(values) {
    try {
      setIsLoading(true);
      notify('new', 'loading', 'Saving changes...');
      await API({ service: 'devices', resourceId: _id, operation: 'edit', method: 'PUT', body: values });
      mutate({ ...device, ...values });
      router.push(`/devices/${_id}`);
      notify('new', 'success', 'Changes saved!');
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      notify('new', 'error', 'An error occurred.');
    }
  }

  return device ? (
    <form onSubmit={form.onSubmit(handleSave)}>
      <PageContainer title={'Devices › ' + (form.values.title || 'New Device')}>
        <LoadingOverlay visible={isLoading} />
        <Toolbar>
          <Button type={'submit'} icon={<IoSave />} label={'Save'} color={'primary'} />
          <Button icon={<IoClose />} label={'Cancel'} onClick={handleCancel} />
        </Toolbar>

        <Group>
          <GridCell>
            <Label>Unique Device Code</Label>
            <Value>{device.code || '-'}</Value>
          </GridCell>
        </Group>

        <Group title={'General Details'}>
          <Grid>
            <TextInput label={'Title'} placeholder={'Main Register'} {...form.getInputProps('title')} />
            <Select
              label='Location'
              placeholder='Where is this device located'
              data={formatSelectData(locations)}
              {...form.getInputProps('location')}
            />
          </Grid>
          <Grid>
            <MultiSelect
              label='Authorized Users'
              placeholder='Choose who will have access to this device'
              data={formatSelectData(users, 'name')}
              {...form.getInputProps('users')}
            />
          </Grid>
        </Group>

        <Group title={'Products + Prices'}>
          <Select
            label='Layout'
            placeholder='What product list should this device display'
            data={formatSelectData(layouts)}
            {...form.getInputProps('layout')}
          />
          <MultiSelect
            label='Available Discounts'
            placeholder='Choose which discounts are available for this device'
            data={formatSelectData(discounts)}
            {...form.getInputProps('discounts')}
          />
        </Group>

        <Group title={'Payments'}>
          <MultiSelect
            label='Checking Accounts'
            placeholder='Choose which checking accounts are available for this device'
            data={formatSelectData(checkingAccounts)}
            {...form.getInputProps('checking_accounts')}
          />
        </Group>
      </PageContainer>
    </form>
  ) : (
    <Loading />
  );
}
