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

export default function EditUser() {
  //

  const router = useRouter();
  const { _id } = router.query;

  const { data: user, mutate } = useSWR(`/api/users/${_id}`);

  const hasUpdatedFields = useRef(false);

  function handleCancel() {
    router.push(`/users/${_id}`);
  }

  async function handleSave(values) {
    try {
      // Display notification to the user
      toast.loading('A guardar alterações...', { toastId: _id });
      // Send the request to the API
      const response = await fetch(`/api/users/${_id}/edit`, {
        method: 'PUT',
        body: JSON.stringify(values),
      });
      // Parse the response to JSON
      const parsedResponse = await response.json();
      // Throw an error if the response is not OK
      if (!response.ok) throw new Error(parsedResponse.message);
      // Revalidate the user
      mutate({ ...user, ...values });
      // Find the index of the updated customer in the original list...
      router.push('/users/' + _id);
      // Update notification
      toast.update(_id, { render: 'Alterações guardadas!', type: 'success', isLoading: false, autoClose: true });
    } catch (err) {
      console.log(err);
      toast.update(_id, { render: 'Error', type: 'error', isLoading: false });
    }
  }

  const form = useForm({
    initialValues: {
      name: '',
      role: '',
      pwd: '',
    },
    validate: {
      name: (value) => (value ? null : 'Invalid Title'),
      role: (value) => (value ? null : 'Invalid Title'),
      pwd: (value) => (value ? null : 'Invalid Title'),
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

  return user ? (
    <PageContainer title={'Colaboradores › ' + (form.values.name || 'Sem Nome')}>
      <form onSubmit={form.onSubmit(handleSave)}>
        <Toolbar>
          <Button type={'submit'} icon={<IoSave />} label={'Guardar'} color={'success'} />
          <Button icon={<IoClose />} label={'Cancelar'} onClick={handleCancel} />
        </Toolbar>

        <Grid>
          <TextField label={'Nome'} type={'text'} {...form.getInputProps('name')} />
          <TextField label={'Posição'} type={'text'} {...form.getInputProps('role')} />
          <TextField label={'Password'} type={'text'} {...form.getInputProps('pwd')} />
        </Grid>
      </form>
    </PageContainer>
  ) : (
    <Loading />
  );
}
