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
import { useState } from 'react';
import { IoSave, IoClose } from 'react-icons/io5';
import { useForm, zodResolver } from '@mantine/form';
import { randomId } from '@mantine/hooks';
import Schema from '../../../schemas/Product';
import { useEffect, useRef } from 'react';
import { TextInput, Textarea, Select, LoadingOverlay, NumberInput } from '@mantine/core';
import { TbCurrencyEuro } from 'react-icons/tb';

export default function EditProduct() {
  //

  const router = useRouter();
  const { _id } = router.query;

  const { data: product, mutate } = useSWR(`/api/products/${_id}`);

  const [isLoading, setIsLoading] = useState(false);
  const hasUpdatedFields = useRef(false);

  const form = useForm({
    schema: zodResolver(Schema),
    initialValues: {
      title: '',
      short_title: '',
      image: '',
      description: '',
      variations: [{ title: '', price: 0, tax_id: null, _id: '' }],
    },
  });

  function handleCancel() {
    router.push(`/products/${_id}`);
  }

  async function handleSave(values) {
    try {
      notify(_id, 'loading', 'A guardar alterações...');
      await API({ service: 'products', resourceId: _id, operation: 'edit', method: 'PUT', body: values });
      mutate();
      router.push(`/products/${_id}`);
      notify(_id, 'success', 'Alterações guardadas!');
    } catch (err) {
      console.log(err);
      notify(_id, 'error', 'Ocorreu um erro.');
    }
  }

  useEffect(() => {
    if (!hasUpdatedFields.current && product) {
      form.setValues(product);
      hasUpdatedFields.current = true;
    }
  }, [product, form]);

  return product ? (
    <form onSubmit={form.onSubmit(handleSave)}>
      <PageContainer title={'Products › ' + (form.values.title || 'Sem Nome')}>
        <LoadingOverlay visible={isLoading} />
        <Toolbar>
          <Button type={'submit'} icon={<IoSave />} label={'Save'} color={'primary'} />
          <Button icon={<IoClose />} label={'Cancel'} onClick={handleCancel} />
        </Toolbar>

        <Group title={'About this product'}>
          <Grid>
            <TextInput label={'Title'} placeholder={'Chocolate Bar'} {...form.getInputProps('title')} />
            <TextInput label={'Short Title'} placeholder={'Choco Bar'} {...form.getInputProps('short_title')} />
            <TextInput label={'Image Key'} placeholder={'filename.jpg'} {...form.getInputProps('image')} />
          </Grid>
          <Textarea label="Description" placeholder={'How should this product be presented'} {...form.getInputProps('description')} />
        </Group>

        <Group title={'Variations'}>
          {form.values.variations.map((item, index) => (
            <Group key={item._id}>
              <Grid>
                <TextInput label={'Variation Title'} placeholder={'Normal'} {...form.getInputProps(`variations.${index}.title`)} />
                <NumberInput icon={<TbCurrencyEuro />} label={'Price'} placeholder={'2.99'} precision={2} hideControls {...form.getInputProps(`variations.${index}.price`)} />
                <Select
                  label="Tax Class"
                  placeholder="Pick one"
                  data={[
                    { value: 'NOR', label: 'Normal (23%)' },
                    { value: 'INT', label: 'Intermédia (13%)' },
                    { value: 'RED', label: 'Reduzida (6%)' },
                  ]}
                  {...form.getInputProps(`variations.${index}.tax_id`)}
                />
                <TextInput label={'Variation ID'} placeholder={'Normal'} {...form.getInputProps(`variations.${index}._id`)} />
              </Grid>
              <Button icon={<IoClose />} label={'Remove Variation'} onClick={() => form.removeListItem('variations', index)} />
            </Group>
          ))}
        </Group>

        <Button css={{ marginTop: '$md' }} onClick={() => form.insertListItem('variations', { title: '', price: 0, tax_id: '', key: randomId() })}>
          Add Variation
        </Button>
      </PageContainer>
    </form>
  ) : (
    <Loading />
  );
}
