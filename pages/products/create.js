import useSWR from 'swr';
import { useRouter } from 'next/router';
import { styled } from '@stitches/react';
import { toast } from 'react-toastify';
import Button from '../../components/Button';
import Loading from '../../components/Loading';
import PageContainer from '../../components/PageContainer';
import Toolbar from '../../components/Toolbar';
import Group from '../../components/Group';
import TextField from '../../components/TextField';
import { IoSave, IoClose } from 'react-icons/io5';
import { useForm, formList } from '@mantine/form';
import { randomId } from '@mantine/hooks';
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

export default function CreateProduct() {
  //

  const router = useRouter();

  function handleCancel() {
    router.push('/products/');
  }

  async function handleSave(values) {
    try {
      toast.loading('A guardar alterações...', { toastId: 'new' });
      // Send the request to the API
      const response = await fetch(`/api/products/create`, {
        method: 'POST',
        body: JSON.stringify(values),
      });
      // Parse the response to JSON
      const parsedResponse = await response.json();
      // Throw an error if the response is not OK
      if (!response.ok) throw new Error(parsedResponse.message);
      // Find the index of the updated customer in the original list...
      router.push('/products/' + parsedResponse._id);
      // Display notification to the user
      toast.update('new', { render: 'Alterações guardadas!', type: 'success', isLoading: false, autoClose: true });
    } catch (err) {
      console.log(err);
      toast.update('new', { render: 'Error', type: 'error', isLoading: false });
    }
  }

  const form = useForm({
    initialValues: {
      title: '',
      short_title: '',
      image: '',
      description: '',
      variations: formList([{ title: '', price: 0, vat: '', key: randomId() }]),
    },
    validate: {
      title: (value) => (value ? null : 'Invalid Title'),
      short_title: (value) => (value ? null : 'Invalid Title'),
    },
  });

  return (
    <PageContainer title={'Produtos › ' + (form.values.title || 'Novo Produto')}>
      <form onSubmit={form.onSubmit(handleSave)}>
        <Toolbar>
          <Button type={'submit'} icon={<IoSave />} label={'Guardar'} color={'success'} />
          <Button icon={<IoClose />} label={'Cancelar'} onClick={handleCancel} />
        </Toolbar>

        <Grid css={{ marginBottom: '$md' }}>
          <TextField label={'Title'} type={'text'} {...form.getInputProps('title')} />
          <TextField label={'Título Curto'} type={'text'} {...form.getInputProps('short_title')} />
          <TextField label={'Imagem'} type={'text'} {...form.getInputProps('image')} />
          <TextField label={'Descrição'} type={'text'} {...form.getInputProps('description')} />
        </Grid>

        <Group title={'Variações'} css={{ marginTop: '$md', display: 'flex', gap: '$md' }}>
          {form.values.variations.map((item, index) => (
            <Group key={item.key}>
              <Grid css={{ marginBottom: '$md' }}>
                <TextField label={'Título'} type={'text'} {...form.getListInputProps('variations', index, 'title')} />
                <TextField label={'Preço'} type={'number'} {...form.getListInputProps('variations', index, 'price')} />
                <TextField label={'VAT'} type={'number'} {...form.getListInputProps('variations', index, 'vat')} />
              </Grid>
              <Button icon={<IoClose />} label={'Remover Variação'} onClick={() => form.removeListItem('variations', index)} />
            </Group>
          ))}
        </Group>

        <Button css={{ marginTop: '$md' }} onClick={() => form.addListItem('variations', { title: '', price: 0, vat: '', key: randomId() })}>
          Add Variation
        </Button>
      </form>
    </PageContainer>
  );
}
