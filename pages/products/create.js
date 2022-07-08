import { useRouter } from 'next/router';
import Button from '../../components/Button';
import PageContainer from '../../components/PageContainer';
import Toolbar from '../../components/Toolbar';
import Group from '../../components/Group';
import { Grid } from '../../components/Grid';
import { IoSave, IoClose } from 'react-icons/io5';
import { useForm, formList, zodResolver } from '@mantine/form';
import { randomId } from '@mantine/hooks';
import API from '../../services/API';
import notify from '../../services/notify';
import { TextInput, Textarea, Select, LoadingOverlay, NumberInput } from '@mantine/core';
import Schema from '../../schemas/Product';
import { useState } from 'react';
import { TbCurrencyEuro } from 'react-icons/tb';

export default function CreateProduct() {
  //

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    schema: zodResolver(Schema),
    initialValues: {
      title: '',
      short_title: '',
      image: '',
      description: '',
      variations: formList([{ title: '', price: 0, tax_id: null, key: randomId() }]),
    },
  });

  function handleCancel() {
    router.push('/products/');
  }

  async function handleSave(values) {
    try {
      setIsLoading(true);
      notify('new', 'loading', 'Saving changes...');
      const response = await API({ service: 'products', operation: 'create', method: 'POST', body: values });
      router.push(`/products/${response._id}`);
      notify('new', 'success', 'Changes saved!');
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      notify('new', 'error', 'An error occurred.');
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={form.onSubmit(handleSave)}>
      <PageContainer title={'Products › ' + (form.values.title || 'New Product')}>
        <LoadingOverlay visible={isLoading} />
        <Toolbar>
          <Button type={'submit'} icon={<IoSave />} label={'Save'} color={'success'} />
          <Button icon={<IoClose />} label={'Cancel'} onClick={handleCancel} />
        </Toolbar>

        <Group title={'About this product'}>
          <Grid>
            <TextInput label={'Title'} placeholder={'Chocolate Bar'} {...form.getInputProps('title')} />
            <TextInput label={'Short Title'} placeholder={'Choco Bar'} {...form.getInputProps('short_title')} />
            <TextInput label={'Image Key'} placeholder={'filename.jpg'} {...form.getInputProps('image')} />
          </Grid>
          <Textarea
            label='Description'
            placeholder={'How should this product be presented'}
            {...form.getInputProps('description')}
          />
        </Group>

        <Group title={'Variations'}>
          {form.values.variations.map((item, index) => (
            <Group key={item.key}>
              <Grid>
                <TextInput
                  label={'Variation Title'}
                  placeholder={'Normal'}
                  {...form.getListInputProps('variations', index, 'title')}
                />
                <NumberInput
                  icon={<TbCurrencyEuro />}
                  label={'Price'}
                  placeholder={'2.99'}
                  precision={2}
                  hideControls
                  {...form.getListInputProps('variations', index, 'price')}
                />
                <Select
                  label='Tax Class'
                  placeholder='Pick one'
                  data={[
                    { value: 'NOR', label: 'Normal (23%)' },
                    { value: 'INT', label: 'Intermédia (13%)' },
                    { value: 'RED', label: 'Reduzida (6%)' },
                  ]}
                  {...form.getListInputProps('variations', index, 'tax_id')}
                />
              </Grid>
              <Button
                icon={<IoClose />}
                label={'Remove Variation'}
                onClick={() => form.removeListItem('variations', index)}
              />
            </Group>
          ))}
        </Group>

        <Button
          color={'primary'}
          onClick={() => form.addListItem('variations', { title: '', price: 0, tax_id: '', key: randomId() })}
        >
          Add Variation
        </Button>
      </PageContainer>
    </form>
  );
}
