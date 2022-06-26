import { styled } from '../stitches.config';

/* * */
/* PAGE TITLE */
/* Explanation needed. */
/* * */

const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$md',
});

const Title = styled('p', {
  fontSize: '30px',
  fontWeight: '$bold',
  borderBottomWidth: '$md',
  borderBottomStyle: 'solid',
  borderBottomColor: '$gray2',
  paddingBottom: '$sm',
});

const Contents = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$md',
});

export default function PageContainer({ title, children }) {
  return (
    <Container>
      <Title>{title}</Title>
      <Contents>{children}</Contents>
    </Container>
  );
}
