import useSWR from 'swr';
import { useRouter } from 'next/router';
import { styled } from '@stitches/react';
import Button from '../../../components/Button';
import { Grid, GridCell, Label, Value } from '../../../components/Grid';
import API from '../../../services/API';
import notify from '../../../services/notify';
import Loading from '../../../components/Loading';
import PageContainer from '../../../components/PageContainer';
import Toolbar from '../../../components/Toolbar';
import Group from '../../../components/Group';
import Alert from '../../../components/Alert';
import { IoPencil, IoTrash, IoDuplicate } from 'react-icons/io5';
import { useEffect, useState } from 'react';

/* * */
/* VIEW DISCOUNT */
/* Explanation needed. */
/* * */

/* */
/* STYLES */

const AndOrLabel = styled('p', {
  fontSize: '15px',
  fontWeight: '$bold',
  textTransform: 'uppercase',
  color: '$gray10',
  padding: '$sm',
});

/* */
/* LOGIC */

export default function ViewDiscount() {
  //

  const router = useRouter();
  const { _id } = router.query;

  const { data: discount } = useSWR(`/api/discounts/${_id}`);
  const { data: products } = useSWR(`/api/products`);

  const [formatedDiscountRules, setFormatedDiscountRules] = useState([]);

  useEffect(() => {
    if (discount && products) {
      // Format variations
      const formatedVariations = [];
      for (const product of products) {
        for (const variation of product.variations) {
          formatedVariations.push({
            product_id: product._id,
            variation_id: variation._id,
            product_variation_title: `${product.title} - ${variation.title}`,
            variation_price: variation.price,
          });
        }
      }
      // Format discount rules
      const formatedRules = [];
      for (const ruleGroup of discount.rules) {
        const formatedRuleGroup = [];
        for (const variationId of ruleGroup) {
          const thisVariation = formatedVariations.find((so) => so.variation_id == variationId);
          formatedRuleGroup.push(thisVariation);
        }
        formatedRules.push(formatedRuleGroup);
      }
      setFormatedDiscountRules(formatedRules);
    }
  }, [discount, products]);

  async function handleEditDiscount() {
    router.push(`/discounts/${_id}/edit`);
  }

  async function handleDuplicateDiscount() {
    try {
      // Display notification to the user
      notify(_id, 'loading', 'A duplicar desconto...');
      // Send the request to the API
      const response = await API({ service: 'discounts', resourceId: _id, operation: 'duplicate', method: 'GET' });
      // Find the index of the updated customer in the original list...
      router.push('/discounts/' + response._id);
      notify(_id, 'success', 'Desconto duplicado!');
    } catch (err) {
      console.log(err);
      notify(_id, 'error', 'Ocorreu um erro.');
    }
  }

  async function handleDeleteDiscount() {
    try {
      // Display notification to the user
      notify(_id, 'loading', 'A eliminar desconto...');
      // Send the request to the API
      await API({ service: 'discounts', resourceId: _id, operation: 'delete', method: 'DELETE' });
      // Find the index of the updated customer in the original list...
      router.push('/discounts');
      // Update notification
      notify(_id, 'success', 'Desconto eliminado!');
    } catch (err) {
      console.log(err);
      notify(_id, 'error', 'Ocorreu um erro.');
    }
  }

  return discount && products ? (
    <PageContainer title={'Descontos › ' + discount.title}>
      <Toolbar>
        <Button icon={<IoPencil />} label={'Editar'} onClick={handleEditDiscount} />
        <Button icon={<IoDuplicate />} label={'Duplicar'} onClick={handleDuplicateDiscount} />
        <Button
          icon={<IoTrash />}
          label={'Apagar'}
          color={'danger'}
          alert={
            <Alert
              color={'danger'}
              title={'Eliminar Desconto'}
              subtitle={'Tem a certeza que pretende eliminar este desconto?'}
              message={'Esta acção é irreversível e imediata.'}
              onConfirm={handleDeleteDiscount}
            />
          }
        />
      </Toolbar>

      <Group title={'Informações Gerais'}>
        <Grid>
          <GridCell>
            <Label>Nome</Label>
            <Value>{discount.title || '-'}</Value>
          </GridCell>
          <GridCell>
            <Label>Valor do Desconto</Label>
            <Value>{`${discount.amount}€` || '-'}</Value>
          </GridCell>
        </Grid>
      </Group>

      <Group title={'Aplicar desconto se na compra existir'}>
        {formatedDiscountRules.map((variationGroups, variationGroupsIndex) => (
          <div key={variationGroupsIndex}>
            {variationGroupsIndex > 0 && <AndOrLabel>e também</AndOrLabel>}
            <Group title={'Qualquer um destes produtos'}>
              {variationGroups.map((variation, variationIndex) => (
                <div key={variation?.variation_id}>
                  {variationIndex > 0 && <AndOrLabel>Ou</AndOrLabel>}
                  <Grid css={{ border: '2px solid $gray4' }} clickable onClick={() => router.push(`/products/${variation.product_id}`)}>
                    <GridCell>
                      <Label>Título</Label>
                      <Value>{variation?.product_variation_title || '-'}</Value>
                    </GridCell>
                    <GridCell>
                      <Label>Preço</Label>
                      <Value>{`${variation?.variation_price}€`}</Value>
                    </GridCell>
                  </Grid>
                </div>
              ))}
            </Group>
          </div>
        ))}
      </Group>
    </PageContainer>
  ) : (
    <Loading />
  );
}
