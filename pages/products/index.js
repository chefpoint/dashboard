import styles from '../../styles/dashboard/DashboardProducts.module.css';
import Sidebar from '../../components/dashboard/sidebar/container/Sidebar';
import useSWR from 'swr';
import ProductListItem from '../../components/dashboard/products/productListItem/ProductListItem';
import Loading from '../../components/common/loading/Loading';
import IconButton from '../../components/common/iconButton/IconButton';

export default function DashboardProducts() {
  //
  const { data: products } = useSWR('/api/products/*');

  return (
    <Sidebar title={'Products'}>
      <div className={styles.toolbar}>
        <IconButton icon={'plus'} label={'New Product'} href={'/dashboard/products/new'} />
      </div>
      <div className={styles.productList}>
        {products ? products.map((product) => <ProductListItem key={product._id} product={product} />) : <Loading />}
      </div>
    </Sidebar>
  );
}
