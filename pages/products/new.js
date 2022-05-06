import styles from '../../styles/dashboard/DashboardProductsAdd.module.css';
import Sidebar from '../../components/dashboard/sidebar/container/Sidebar';
import useSWR from 'swr';
import Loading from '../../components/common/loading/Loading';
import IconButton from '../../components/common/iconButton/IconButton';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function DashboardProductAdd() {
  const router = useRouter();
  //

  const [variationsCount, setVariationsCount] = useState([0]);

  function handleAddVariation() {
    const array = [...variationsCount, variationsCount.length];
    setVariationsCount(array);
  }

  function handleRemoveVariation(element) {
    const array = [...variationsCount];
    array.splice(array.indexOf(element), 1);
    console.log('after', array);
    setVariationsCount(array);
  }

  const registerUser = async (event) => {
    event.preventDefault();

    const res = await fetch('/api/products/new', {
      body: JSON.stringify({
        title: event.target.title.value,
        short_title: event.target.short_title.value,
        description: event.target.description.value,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    const result = await res.json();
    console.log(result);
    // result.user => 'Ada Lovelace'
    router.replace('/dashboard/products/' + result._id);
  };

  return (
    <Sidebar title={'New Product'}>
      <div className={styles.newProductForm}>
        <form onSubmit={registerUser}>
          <div className={'group'}>
            <label htmlFor='title'>Title</label>
            <input id='title' name='title' type='text' autoComplete='title' required />
          </div>
          <div className={'group'}>
            <label htmlFor='short_title'>Short Title</label>
            <input id='short_title' name='short_title' type='text' autoComplete='short_title' required />
          </div>
          <div className={'group'}>
            <label htmlFor='image'>Image SRC</label>
            <input id='image' name='image' type='text' autoComplete='image' required />
          </div>
          <div className={'group'}>
            <label htmlFor='description'>Description</label>
            <textarea id='description' name='description' type='text' autoComplete='description' required></textarea>
          </div>
          <div className={styles.variationsContainer}>
            {variationsCount.map((element) => (
              <div className={styles.variationGroup} key={element}>
                <div className={'group'}>
                  <label htmlFor='variationTitle'>Variation Title</label>
                  <input id='variationTitle' name='variationTitle' type='text' />
                </div>
                <div className={'group'}>
                  <label htmlFor='variationPrice'>Variation Price</label>
                  <input id='variationPrice' name='variationPrice' type='number' />
                </div>
                <div className={'group'}>
                  <label htmlFor='variationTax'>Variation Tax</label>
                  <input id='variationTax' name='variationTax' type='number' />
                </div>
                <IconButton icon={'minus'} label={'Remove Variation'} action={() => handleRemoveVariation(element)} />
              </div>
            ))}

            <div className={'row'}>
              <IconButton icon={'plus'} label={'Add Variation'} action={handleAddVariation} />
            </div>
          </div>
          <button type='submit'>Create</button>
        </form>
      </div>
    </Sidebar>
  );
}
