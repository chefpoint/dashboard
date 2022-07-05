import useSWR from 'swr';
import { useRouter } from 'next/router';
import { styled } from '@stitches/react';
import { toast } from 'react-toastify';
import Button from '../../../components/Button';
import Loading from '../../../components/Loading';
import PageContainer from '../../../components/PageContainer';
import Toolbar from '../../../components/Toolbar';
import Group from '../../../components/Group';
import Alert from '../../../components/Alert';
import { Grid, GridCell, Label, Value } from '../../../components/Grid';
import TextField from '../../../components/TextField';
import { IoSave, IoClose, IoAdd, IoPricetag, IoTrash, IoCopy } from 'react-icons/io5';
import { useForm, formList } from '@mantine/form';
import { randomId } from '@mantine/hooks';
import { useEffect, useRef, useState } from 'react';
import Select from 'react-select';
import FlexWrapper from '../../../components/FlexWrapper';

/* * */
/* EDIT DISCOUNT */
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

export default function Editdiscount() {
  //

  const router = useRouter();
  const { _id } = router.query;

  const { data: discount, mutate } = useSWR(`/api/discounts/${_id}`);
  const { data: products } = useSWR('/api/products');

  const [availableProducts, setAvailableProducts] = useState();

  const hasAlreadyUpdatedOnce = useRef(false);

  /* */
  /* FORM */

  // Discount Title
  const [discountTitle, setDiscountTitle] = useState('');
  function handleChangeDiscountTitle({ target }) {
    // validate(schema, target.value)
    setDiscountTitle(target.value);
  }

  // Discount Subtitle
  const [discountSubtitle, setDiscountSubtitle] = useState('');
  function handleChangeDiscountSubtitle({ target }) {
    // validate(schema, target.value)
    setDiscountSubtitle(target.value);
  }

  // Discount Description
  const [discountDescription, setDiscountDescription] = useState('');
  function handleChangeDiscountDescription({ target }) {
    // validate(schema, target.value)
    setDiscountDescription(target.value);
  }

  // Discount Amount
  const [discountAmount, setDiscountAmount] = useState(0);
  function handleChangeDiscountAmount({ target }) {
    // validate(schema, target.value)
    setDiscountAmount(target.value);
  }

  // Discount Style Fill
  const [discountStyleFill, setDiscountStyleFill] = useState();
  function handleChangeDiscountStyleFill({ target }) {
    // validate(schema, target.value)
    setDiscountStyleFill(target.value);
  }

  // Discount Style Border
  const [discountStyleBorder, setDiscountStyleBorder] = useState();
  function handleChangeDiscountStyleBorder({ target }) {
    // validate(schema, target.value)
    setDiscountStyleBorder(target.value);
  }

  // Discount Style Text
  const [discountStyleText, setDiscountStyleText] = useState();
  function handleChangeDiscountStyleText({ target }) {
    // validate(schema, target.value)
    setDiscountStyleText(target.value);
  }

  // Discount Rules
  const [discountRules, setDiscountRules] = useState([]);

  function handleAddRuleGroup() {
    const newRules = [...discountRules]; // Copy the rules state
    newRules.push([{}]); // Create new group at the end of the primary array
    setDiscountRules(newRules); // Update state with new rules
  }

  function handleAddRuleGroupVariation(variationGroupIndex) {
    const newRules = [...discountRules]; // Copy the rules state
    newRules[variationGroupIndex].push({}); // Create new variation at the end of the group array
    setDiscountRules(newRules); // Update state with new rules
  }

  function handleRemoveRuleGroupVariation(variationGroupIndex, variationIndex) {
    const newRules = [...discountRules]; // Copy the rules state
    newRules[variationGroupIndex].splice(variationIndex, 1); // Remove the variation at index
    if (!newRules[variationGroupIndex].length) newRules.splice(variationGroupIndex, 1); // Remove group if it has no variations
    setDiscountRules(newRules); // Update state with new rules
  }

  function handleChangeRuleGroupVariation(option, variationGroupIndex, variationIndex) {
    const newRules = [...discountRules]; // Copy the rules state
    newRules[variationGroupIndex][variationIndex] = option; // Update variation at index with selected option
    setDiscountRules(newRules); // Update state with new rules
  }

  /* */
  /* RUN ON UPDATE STATE */

  // Format product list to conform to React-Select {value: label:}
  useEffect(() => {
    // Run on every state update
    if (products) {
      let productsListOptions = [];
      for (const product of products) {
        for (const variation of product.variations) {
          productsListOptions.push({
            value: variation._id,
            label: `${product.title} - ${variation.title}`,
          });
        }
      }
      setAvailableProducts(productsListOptions);
    }
  }, [products]);

  // Update fields with values from the API
  useEffect(() => {
    // Only run once, and if 'discount' and 'availableProducts' are set
    if (!hasAlreadyUpdatedOnce.current && discount && availableProducts) {
      if (discount.title) setDiscountTitle(discount.title);
      if (discount.subtitle) setDiscountSubtitle(discount.subtitle);
      if (discount.description) setDiscountDescription(discount.description);
      if (discount.amount) setDiscountAmount(discount.amount);
      if (discount.style) {
        if (discount.style.fill) setDiscountStyleFill(discount.style.fill);
        if (discount.style.border) setDiscountStyleBorder(discount.style.border);
        if (discount.style.text) setDiscountStyleText(discount.style.text);
      }
      if (discount.rules) {
        let formattedRules = [];
        for (const ruleGroup of discount.rules) {
          let formattedRuleGroup = [];
          for (const variationId of ruleGroup) {
            const thisOption = availableProducts.find((product) => product.value == variationId);
            formattedRuleGroup.push(thisOption);
          }
          formattedRules.push(formattedRuleGroup);
        }
        setDiscountRules(formattedRules);
      }
      // Set to true after successful run
      hasAlreadyUpdatedOnce.current = true;
    }
  }, [discount, products, availableProducts]);

  /* */
  /* HANDLERS */

  function handleCancel() {
    router.push(`/discounts/${_id}`);
  }

  async function handleSave() {
    // Format the discount as requested by the API
    const discountToSave = {
      title: discountTitle,
      subtitle: discountSubtitle,
      description: discountDescription,
      amount: discountAmount,
      style: {
        fill: discountStyleFill,
        border: discountStyleBorder,
        text: discountStyleText,
      },
      rules: [],
    };
    // Simplify the rules to be an array of arrays of strings: [['_id', '_id'], ['_id', '_id']]
    for (const ruleGroup of discountRules) {
      let simplifiedRuleGroup = [];
      for (const variation of ruleGroup) {
        simplifiedRuleGroup.push(variation.value);
      }
      discountToSave.rules.push(simplifiedRuleGroup);
    }

    // Try to save the object to the API
    try {
      // Display notification to the user
      toast.loading('A guardar alterações...', { toastId: _id });
      // Send the request to the API
      const response = await fetch(`/api/discounts/${_id}/edit`, {
        method: 'PUT',
        body: JSON.stringify(discountToSave),
      });
      // Parse the response to JSON
      const parsedResponse = await response.json();
      // Throw an error if the response is not OK
      if (!response.ok) throw new Error(parsedResponse.message);
      // Revalidate the discount
      mutate({ ...discount, ...discountToSave });
      // Find the index of the updated customer in the original list...
      router.push(`/discounts/${_id}`);
      // Update notification
      toast.update(_id, { render: 'Alterações guardadas!', type: 'success', isLoading: false, autoClose: true });
    } catch (err) {
      console.log(err);
      toast.update(_id, { render: 'Error', type: 'error', isLoading: false, autoClose: true });
    }
  }

  /* */
  /* RENDER */

  return discount && products ? (
    <PageContainer title={'Descontos › ' + (discountTitle || 'Sem Nome')}>
      <Toolbar>
        <Button icon={<IoSave />} label={'Guardar'} color={'success'} onClick={handleSave} />
        <Button icon={<IoClose />} label={'Cancelar'} onClick={handleCancel} />
      </Toolbar>

      <Grid>
        <TextField label={'Title'} type={'text'} value={discountTitle} onChange={handleChangeDiscountTitle} />
        <TextField label={'Subtitle'} type={'text'} value={discountSubtitle} onChange={handleChangeDiscountSubtitle} />
        <TextField label={'Descrição'} type={'text'} value={discountDescription} onChange={handleChangeDiscountDescription} />
        <TextField label={'Amount'} type={'number'} min={0} value={discountAmount} onChange={handleChangeDiscountAmount} />
      </Grid>

      <Group title={'Estilos'}>
        <Grid>
          <TextField label={'Cor do Fundo'} type={'color'} value={discountStyleFill} onChange={handleChangeDiscountStyleFill} />
          <TextField label={'Cor das Bordas'} type={'color'} value={discountStyleBorder} onChange={handleChangeDiscountStyleBorder} />
          <TextField label={'Cor do Texto'} type={'color'} value={discountStyleText} onChange={handleChangeDiscountStyleText} />
        </Grid>
      </Group>

      <Group title={'Aplicar desconto se na compra existir'}>
        <FlexWrapper>
          <div>
            {discountRules.map((variationGroup, variationGroupIndex) => (
              <div key={randomId()}>
                {variationGroupIndex > 0 && <AndOrLabel>e também</AndOrLabel>}
                <Group title={'Qualquer um destes produtos'}>
                  <FlexWrapper key={randomId()}>
                    <div>
                      {variationGroup.map((variation, variationIndex) => (
                        <div key={randomId()}>
                          {variationIndex > 0 && <AndOrLabel>Ou</AndOrLabel>}
                          <Grid layout={'iconRight'}>
                            <Select
                              value={discountRules[variationGroupIndex][variationIndex]}
                              onChange={(option) => handleChangeRuleGroupVariation(option, variationGroupIndex, variationIndex)}
                              cacheOptions
                              defaultOptions
                              options={availableProducts}
                            />
                            <Button
                              icon={<IoTrash />}
                              color={'danger'}
                              alert={
                                <Alert
                                  color={'danger'}
                                  title={'Remover Produto'}
                                  subtitle={'Tem a certeza que pretende remover este produto do desconto?'}
                                  onConfirm={() => handleRemoveRuleGroupVariation(variationGroupIndex, variationIndex)}
                                />
                              }
                            />
                          </Grid>
                        </div>
                      ))}
                    </div>
                    <Button
                      icon={<IoPricetag />}
                      label={'Adicionar Produto a este Grupo'}
                      onClick={() => handleAddRuleGroupVariation(variationGroupIndex)}
                    />
                  </FlexWrapper>
                </Group>
              </div>
            ))}
          </div>
          <Button icon={<IoCopy />} label={'Adicionar Grupo'} color={'primary'} onClick={handleAddRuleGroup} />
        </FlexWrapper>
      </Group>
    </PageContainer>
  ) : (
    <Loading />
  );
}
