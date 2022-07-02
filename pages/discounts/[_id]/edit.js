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
import { IoSave, IoClose, IoAdd, IoPulse } from 'react-icons/io5';
import { useForm, formList } from '@mantine/form';
import { randomId } from '@mantine/hooks';
import { useEffect, useRef, useState } from 'react';
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

export default function Editdiscount() {
  //

  const router = useRouter();
  const { _id } = router.query;

  const { data: discount, mutate } = useSWR(`/api/discounts/${_id}`);

  const hasUpdatedFields = useRef(false);

  function handleCancel() {
    router.push(`/discounts/${_id}`);
  }

  async function handleSave(values) {
    try {
      // Display notification to the user
      toast.loading('A guardar alterações...', { toastId: _id });
      // Send the request to the API
      const response = await fetch(`/api/discounts/${_id}/edit`, {
        method: 'PUT',
        body: JSON.stringify(values),
      });
      // Parse the response to JSON
      const parsedResponse = await response.json();
      // Throw an error if the response is not OK
      if (!response.ok) throw new Error(parsedResponse.message);
      // Revalidate the discount
      mutate({ ...discount, ...values });
      // Find the index of the updated customer in the original list...
      router.push('/discounts/' + _id);
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
      subtitle: '',
      description: '',
      amount: 0,
      rules: formList([formList([{ variation_id: '', key: randomId() }])]),
    },
    validate: {
      title: (value) => (value ? null : 'Invalid Title'),
    },
  });

  const variationOptions = async (inputValue) => {
    try {
      const response = await fetch(`/api/products/`, { method: 'GET' });
      const parsedResponse = await response.json();
      if (!response.ok) throw new Error(parsedResponse.message);
      let options = [];
      for (const product of parsedResponse) {
        for (const variation of product.variations) {
          options.push({ value: variation._id, label: product.title + ' - ' + variation.title });
        }
      }
      return options.filter((i) => i.label?.toLowerCase().includes(inputValue.toLowerCase()));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!hasUpdatedFields.current && discount) {
      //

      let formatedRules = [];
      for (const [index, ruleGroup] of discount.rules.entries()) {
        let formatedRuleGroup = [];
        for (const [index, productVariationId] of ruleGroup.entries()) {
          formatedRuleGroup.push(productVariationId);
        }
        formatedRules.push(formatedRuleGroup);
      }
      setRules(formatedRules);

      form.setValues({
        title: discount.title || '',
        subtitle: discount.subtitle || '',
        description: discount.description || '',
        amount: discount.amount || 0,
        rules: formList(formatedRules),
      });

      hasUpdatedFields.current = true;
    }
  }, [discount, form]);

  const [rules, setRules] = useState([
    ['A1', 'A2', 'A3'],
    ['B1', 'B2', 'B3'],
    ['C1', 'C2', 'C3'],
  ]);

  return discount ? (
    <PageContainer title={'Descontos › ' + (form.values.title || 'Sem Nome')}>
      <form onSubmit={form.onSubmit(handleSave)}>
        <Toolbar>
          <Button type={'submit'} icon={<IoSave />} label={'Guardar'} color={'success'} />
          <Button icon={<IoClose />} label={'Cancelar'} onClick={handleCancel} />
        </Toolbar>

        <Grid css={{ marginBottom: '$md' }}>
          <TextField label={'Title'} type={'text'} {...form.getInputProps('title')} />
          <TextField label={'Subtitle'} type={'text'} {...form.getInputProps('subtitle')} />
          <TextField label={'Descrição'} type={'text'} {...form.getInputProps('description')} />
          <TextField label={'Amount'} type={'text'} {...form.getInputProps('amount')} />
        </Grid>

        <Group title={'Regras'} css={{ marginTop: '$md', display: 'flex', gap: '$md' }}>
          {rules.map((orRules, index1) => (
            <>
              <Group title={'Group'} key={index1}>
                {orRules.map((andRule, index2) => (
                  <>
                    <Grid key={index1 + '-' + index2}>
                      <AsyncSelect cacheOptions defaultOptions loadOptions={variationOptions} />
                      <Button icon={<IoClose />} label={'Remover'} onClick={() => {}} />
                    </Grid>
                    <p key={index1 + '--' + index2}>OR</p>
                  </>
                ))}
                <Button icon={<IoAdd />} label={'Adicionar Variação'} onClick={() => {}} />
              </Group>
              <p key={index1 + 'k'}>AND</p>
            </>
          ))}
        </Group>

        <Button css={{ marginTop: '$md' }} onClick={() => form.addListItem('rules', formList([{ variation_id: '', key: randomId() }]))}>
          Add OR Group
        </Button>
      </form>
    </PageContainer>
  ) : (
    <Loading />
  );
}
