import useSWR from 'swr';
import { useRouter } from 'next/router';
import { styled } from '@stitches/react';
import Button from '../../../components/Button';
import Loading from '../../../components/Loading';
import PageContainer from '../../../components/PageContainer';
import Toolbar from '../../../components/Toolbar';
import API from '../../../services/API';
import notify from '../../../services/notify';
import Group from '../../../components/Group';
import Alert from '../../../components/Alert';
import { Grid } from '../../../components/Grid';
import { TextInput, Textarea, Select, ColorInput, LoadingOverlay, NumberInput } from '@mantine/core';
import { IoSave, IoClose, IoPricetag, IoTrash, IoCopy } from 'react-icons/io5';
import { randomId } from '@mantine/hooks';
import { useEffect, useRef, useState } from 'react';
import { TbCurrencyEuro } from 'react-icons/tb';
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

export default function EditDiscount() {
  //

  const router = useRouter();
  const { _id } = router.query;

  const { data: discount, mutate } = useSWR(`/api/discounts/${_id}`);
  const { data: products } = useSWR('/api/products');

  const [isLoading, setIsLoading] = useState(false);
  const hasAlreadyUpdatedOnce = useRef(false);

  /* */
  /* FORM */

  // Discount Title
  const [discountTitle, setDiscountTitle] = useState('');
  // Discount Subtitle
  const [discountSubtitle, setDiscountSubtitle] = useState('');
  // Discount Description
  const [discountDescription, setDiscountDescription] = useState('');
  // Discount Amount
  const [discountAmount, setDiscountAmount] = useState(0);
  // Styles
  const [discountStyleFill, setDiscountStyleFill] = useState('');
  const [discountStyleBorder, setDiscountStyleBorder] = useState('');
  const [discountStyleText, setDiscountStyleText] = useState('');
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
  function formatAvailableProducts(data = []) {
    const formatted = [];
    if (!data) return formatted;
    for (const product of data) {
      for (const variation of product.variations) {
        formatted.push({
          value: variation._id,
          label: `${product.title} - ${variation.title} (${variation.price.toFixed(2)}€)`,
        });
      }
    }
    return formatted;
  }

  // Update fields with values from the API
  useEffect(() => {
    // Only run once, and if 'discount' and 'availableProducts' are set
    if (!hasAlreadyUpdatedOnce.current && discount && products) {
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
            formattedRuleGroup.push(variationId);
          }
          formattedRules.push(formattedRuleGroup);
        }
        setDiscountRules(formattedRules);
      }
      // Set to true after successful run
      hasAlreadyUpdatedOnce.current = true;
    }
  }, [discount, products]);

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
      rules: discountRules,
    };

    // Try to save the object to the API
    try {
      setIsLoading(true);
      notify(_id, 'loading', 'A guardar alterações...');
      await API({ service: 'discounts', resourceId: _id, operation: 'edit', method: 'PUT', body: discountToSave });
      mutate({ ...discount, ...discountToSave });
      router.push(`/discounts/${_id}`);
      notify(_id, 'success', 'Alterações guardadas!');
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      notify(_id, 'error', 'Ocorreu um erro.');
    }
  }

  /* */
  /* RENDER */

  return discount && products ? (
    <PageContainer title={'Descontos › ' + (discountTitle || 'Sem Nome')}>
      <LoadingOverlay visible={isLoading} />
      <Toolbar>
        <Button icon={<IoSave />} label={'Save'} color={'primary'} onClick={handleSave} />
        <Button icon={<IoClose />} label={'Cancel'} onClick={handleCancel} />
      </Toolbar>

      <Group title={'General Details'}>
        <Grid>
          <TextInput
            label={'Title'}
            placeholder={'Menu Bom Dia'}
            value={discountTitle}
            onChange={({ target }) => setDiscountTitle(target.value)}
          />
          <TextInput
            label={'Subtitle'}
            placeholder={'Para começar bem, todos os dias!'}
            value={discountSubtitle}
            onChange={({ target }) => setDiscountSubtitle(target.value)}
          />
          <NumberInput
            icon={<TbCurrencyEuro />}
            label={'Discount Amount'}
            placeholder={'0.25'}
            hideControls
            min={0}
            step={0.05}
            precision={2}
            value={discountAmount}
            onChange={setDiscountAmount}
          />
        </Grid>
        <Grid>
          <Textarea
            label='Description'
            placeholder={'What is included in this discount?'}
            value={discountDescription}
            onChange={({ target }) => setDiscountDescription(target.value)}
          />
        </Grid>
      </Group>

      <Group title={'Styles'}>
        <Grid>
          <ColorInput label={'Background Color'} value={discountStyleFill} onChange={setDiscountStyleFill} />
          <ColorInput label={'Border Color'} value={discountStyleBorder} onChange={setDiscountStyleBorder} />
          <ColorInput label={'Text Color'} value={discountStyleText} onChange={setDiscountStyleText} />
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
                              searchable
                              value={discountRules[variationGroupIndex][variationIndex]}
                              onChange={(option) =>
                                handleChangeRuleGroupVariation(option, variationGroupIndex, variationIndex)
                              }
                              data={formatAvailableProducts(products)}
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
