import useSWR from 'swr';
import { useRouter } from 'next/router';
import { styled } from '@stitches/react';
import Button from '../../components/Button';
import Table from '../../components/Table';
import Loading from '../../components/Loading';
import PageContainer from '../../components/PageContainer';

export default function Users() {
  //

  const router = useRouter();
  const { _id } = router.query;

  const { data: user } = useSWR('/api/users/' + _id);

  return user ? (
    <PageContainer title={'Colaboradores › ' + user.name}>
      <p>{user.name}</p>
      <p>{user.role}</p>
      <p>{user.pwd}</p>
    </PageContainer>
  ) : (
    <Loading />
  );
}
