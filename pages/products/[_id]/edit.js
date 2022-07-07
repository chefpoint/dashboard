import useSWR from 'swr';
import { useRouter } from 'next/router';
import Button from '../../../components/Button';
import Loading from '../../../components/Loading';
import PageContainer from '../../../components/PageContainer';
import Toolbar from '../../../components/Toolbar';
import Group from '../../../components/Group';
import API from '../../../services/API';
import notify from '../../../services/notify';
import { Grid } from '../../../components/Grid';
import TextField from '../../../components/TextField';
import { IoSave, IoClose } from 'react-icons/io5';
import { useForm, formList } from '@mantine/form';
import { randomId } from '@mantine/hooks';
import { useEffect, useRef } from 'react';
import Select from 'react-select';

export default function EditProduct() {
  //

  const router = useRouter();
  const { _id } = router.query;

  const { data: product, mutate } = useSWR(`/api/products/${_id}`);

  const hasUpdatedFields = useRef(false);

  function handleCancel() {
    router.push(`/products/${_id}`);
  }

  async function handleSave(values) {
    try {
      notify(_id, 'loading', 'A guardar alterações...');
      await API({ service: 'products', resourceId: _id, operation: 'edit', method: 'PUT', body: values });
      mutate({ ...product, ...values });
      router.push(`/products/${_id}`);
      notify(_id, 'success', 'Alterações guardadas!');
    } catch (err) {
      console.log(err);
      notify(_id, 'error', 'Ocorreu um erro.');
    }
  }

  const form = useForm({
    initialValues: {
      title: '',
      short_title: '',
      image: '',
      description: '',
      variations: formList([{ title: '', price: 0, tax_id: '', key: randomId() }]),
    },
    validate: {
      title: (value) => (value ? null : 'Invalid Title'),
    },
  });

  useEffect(() => {
    if (!hasUpdatedFields.current && product) {
      let formatedVariations = [];
      for (const [index, variation] of product.variations.entries()) {
        formatedVariations.push({
          title: variation.title,
          price: variation.price,
          tax_id: variation.tax_id,
          key: index,
        });
      }
      console.log(formatedVariations);

      form.setValues({
        title: product.title || '',
        short_title: product.short_title || '',
        image: product.image || '',
        description: product.description || '',
        variations: formList(formatedVariations),
      });

      hasUpdatedFields.current = true;
    }
  }, [product, form]);

  return product ? (
    <PageContainer title={'Produtos › ' + (form.values.title || 'Sem Nome')}>
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
                <Select
                  {...form.getListInputProps('variations', index, 'tax_id')}
                  options={[
                    { label: 'Normal (23%)', value: 'NOR' },
                    { label: 'Intermédia (13%)', value: 'INT' },
                    { label: 'Reduzida (6%)', value: 'RED' },
                  ]}
                />
              </Grid>
              <Button icon={<IoClose />} label={'Remover Variação'} onClick={() => form.removeListItem('variations', index)} />
            </Group>
          ))}
        </Group>

        <Button css={{ marginTop: '$md' }} onClick={() => form.addListItem('variations', { title: '', price: 0, tax_id: '', key: randomId() })}>
          Add Variation
        </Button>
      </form>
    </PageContainer>
  ) : (
    <Loading />
  );
}
