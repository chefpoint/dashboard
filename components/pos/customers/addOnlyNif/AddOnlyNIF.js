import styles from './AddOnlyNIF.module.css';

import { useContext, useState } from 'react';
import { GlobalContext } from '../../../../services/context';

import Pannel from '../../../common/pannel/container/Pannel';
import Button from '../../../common/button/Button';

export default function AddOnlyNIF() {
  //
  const { currentOrder, overlay } = useContext(GlobalContext);

  function handleRemoveNIF() {
    currentOrder.setCustomer();
    overlay.setComponent();
  }

  function handleAddNIF(event) {
    event.preventDefault();

    if (event.target.nifRegion.value.length > 0 && event.target.nifRegion.value < 2) return;
    if (event.target.nifNumber.value.length < 9) return;

    const nifRegion = event.target.nifRegion.value || 'PT';
    const nifNumber = event.target.nifNumber.value;

    currentOrder.setCustomer({
      onlyNif: true,
      nif: { region: nifRegion, number: nifNumber },
    });

    overlay.setComponent();
  }

  return (
    <Pannel title={'Add Only NIF'}>
      <form className={styles.formContainer} onSubmit={handleAddNIF}>
        <div className={styles.inputsContainer}>
          <input
            className={styles.nifRegion}
            name={'nifRegion'}
            type={'text'}
            minLength={2}
            maxLength={2}
            defaultValue={currentOrder.customer ? currentOrder.customer.nif.region : ''}
            placeholder={'PT'}
          />
          <input
            className={styles.nifNumber}
            name={'nifNumber'}
            type={'number'}
            maxLength={9}
            placeholder={'_________'}
            required
            defaultValue={currentOrder.customer ? currentOrder.customer.nif.number : ''}
            onInput={({ target }) => (target.value = target.value.slice(0, target.maxLength))}
          />
        </div>
        {currentOrder.customer ? (
          <div className={styles.buttonsContainer}>
            <Button label={'Atualizar NIF'} type={'primary'} />
            <Button label={'Remover'} type={'danger'} action={handleRemoveNIF} />
          </div>
        ) : (
          <Button label={'Adicionar NIF'} type={'primary'} />
        )}
      </form>
    </Pannel>
  );
}
