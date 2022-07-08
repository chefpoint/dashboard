import useSWR from 'swr';
import { useRouter } from 'next/router';
import Button from '../../components/Button';
import PageContainer from '../../components/PageContainer';
import Toolbar from '../../components/Toolbar';
import Group from '../../components/Group';
import { Grid, GridCell, Label, Value } from '../../components/Grid';
import { IoSave, IoClose, IoKeypad } from 'react-icons/io5';
import { useForm, zodResolver } from '@mantine/form';
import { TextInput, LoadingOverlay, Select, MultiSelect } from '@mantine/core';
import Schema from '../../schemas/Device';
import { useState } from 'react';
import API from '../../services/API';
import notify from '../../services/notify';

export default function CreateDevice() {
  //

  const router = useRouter();

  const { data: locations } = useSWR('/api/locations');
  const { data: users } = useSWR('/api/users');
  const { data: discounts } = useSWR('/api/discounts');
  const { data: layouts } = useSWR('/api/layouts');
  const { data: checkingAccounts } = useSWR('/api/checking_accounts');

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

  function formatSelectData(data = [], labelKey = 'title', valueKey = '_id') {
    const formatted = [];
    for (const item of data) formatted.push({ value: item[valueKey], label: item[labelKey] });
    return formatted;
  }

  function handleCancel() {
    router.push('/devices/');
  }

  async function handleSave(values) {
    try {
      setIsLoading(true);
      notify('new', 'loading', 'Saving changes...');
      const response = await API({ service: 'devices', operation: 'create', method: 'POST', body: values });
      router.push(`/devices/${response._id}`);
      notify('new', 'success', 'Changes saved!');
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      notify('new', 'error', 'An error occurred.');
    }
  }

  return (
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
            <Value>-</Value>
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
  );
}
