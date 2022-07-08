import useSWR from 'swr';
import { useRouter } from 'next/router';
import Button from '../../../components/Button';
import Loading from '../../../components/Loading';
import PageContainer from '../../../components/PageContainer';
import Toolbar from '../../../components/Toolbar';
import Group from '../../../components/Group';
import { Grid, GridCell, Label, Value } from '../../../components/Grid';
import Alert from '../../../components/Alert';
import Table from '../../../components/Table';
import { useState } from 'react';
import { IoPencil, IoTrash, IoDuplicate } from 'react-icons/io5';
import { LoadingOverlay } from '@mantine/core';
import API from '../../../services/API';
import notify from '../../../services/notify';

export default function Device() {
  //

  const router = useRouter();
  const { _id } = router.query;

  const { data: device } = useSWR(`/api/devices/${_id}`);

  const [isLoading, setIsLoading] = useState(false);

  async function handleEditDevice() {
    router.push(`/devices/${_id}/edit`);
  }

  async function handleDuplicateDevice() {
    try {
      setIsLoading(true);
      notify(_id, 'loading', 'A duplicar equipamento...');
      const response = await API({ service: 'devices', resourceId: _id, operation: 'duplicate', method: 'GET' });
      router.push(`/devices/${response._id}`);
      notify(_id, 'success', 'Equipamento duplicado!');
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      notify(_id, 'error', 'Ocorreu um erro.');
    }
  }

  async function handleDeleteDevice() {
    try {
      setIsLoading(true);
      notify(_id, 'loading', 'A eliminar equipamento...');
      await API({ service: 'devices', resourceId: _id, operation: 'delete', method: 'DELETE' });
      router.push('/devices');
      notify(_id, 'success', 'Equipamento eliminado!');
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      notify(_id, 'error', 'Ocorreu um erro.');
    }
  }

  function handleOpenLocation() {
    router.push(`/locations/${device.location._id}`);
  }

  function handleOpenLayout() {
    router.push(`/layouts/${device.layout._id}`);
  }

  function handleOpenUser(row) {
    router.push(`/users/${row._id}`);
  }

  function handleOpenDiscounts(row) {
    router.push(`/discounts/${row._id}`);
  }

  function handleOpenCheckingAccount(row) {
    router.push(`/checking_accounts/${row._id}`);
  }

  return device ? (
    <PageContainer title={'Devices › ' + device.title}>
      <LoadingOverlay visible={isLoading} />
      <Toolbar>
        <Button icon={<IoPencil />} label={'Edit'} onClick={handleEditDevice} />
        <Button icon={<IoDuplicate />} label={'Duplicate'} onClick={handleDuplicateDevice} />
        <Button
          icon={<IoTrash />}
          label={'Delete'}
          color={'danger'}
          alert={
            <Alert
              color={'danger'}
              title={'Delete Device'}
              subtitle={'Are you sure you want to delete this device?'}
              message={
                'This action is irreversible and immediate. You will loose all configurations and customizations. All devices currently using this configuration will stop functioning immediatly.'
              }
              onConfirm={handleDeleteDevice}
            />
          }
        />
      </Toolbar>

      <Group>
        <GridCell>
          <Label>Unique Device Code</Label>
          <Value>{device.code || '-'}</Value>
        </GridCell>
      </Group>

      <Group title={'General Details'}>
        <Grid>
          <GridCell>
            <Label>Device Title</Label>
            <Value>{device.title || '-'}</Value>
          </GridCell>
          <GridCell clickable onClick={handleOpenLocation}>
            <Label>Location</Label>
            <Value>{device.location.title || '-'}</Value>
          </GridCell>
        </Grid>
        <Table
          columns={[
            { label: 'Authorized Users', key: 'name' },
            { label: 'Role', key: 'role' },
          ]}
          data={device.users}
          onRowClick={handleOpenUser}
        />
      </Group>

      <Group title={'Products + Prices'}>
        <Grid>
          <GridCell clickable onClick={handleOpenLayout}>
            <Label>Layout</Label>
            <Value>{device.layout.title || '-'}</Value>
          </GridCell>
        </Grid>
        <Table
          columns={[
            { label: 'Available Discounts', key: 'title' },
            { label: 'Amount (€)', key: 'amount' },
          ]}
          data={device.discounts}
          onRowClick={handleOpenDiscounts}
        />
      </Group>

      <Group title={'Payments'}>
        <Table
          columns={[
            { label: 'Available Checking Accounts', key: 'title' },
            { label: 'Client', key: 'client_name' },
          ]}
          data={device.checking_accounts}
          onRowClick={handleOpenCheckingAccount}
        />
      </Group>
    </PageContainer>
  ) : (
    <Loading />
  );
}
