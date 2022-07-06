import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import Button from '../../components/Button';
import PageContainer from '../../components/PageContainer';
import Toolbar from '../../components/Toolbar';
import Group from '../../components/Group';
import { Grid } from '../../components/Grid';
import TextField from '../../components/TextField';
import { IoSave, IoClose } from 'react-icons/io5';
import { useForm, formList } from '@mantine/form';
import { randomId } from '@mantine/hooks';
import API from '../../services/API';
import notify from '../../services/notify';

export default function CreateProduct() {
  //

  const router = useRouter();

  function handleCancel() {
    router.push('/products/');
  }

  async function handleSave(values) {
    try {
      notify('new', 'loading', 'A guardar alterações...');
      const response = await API({ service: 'products', operation: 'create', method: 'POST', body: values });
      router.push(`/products/${response._id}`);
      notify('new', 'success', 'Alterações guardadas!');
    } catch (err) {
      console.log(err);
      notify('new', 'error', 'Ocorreu um erro.');
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
