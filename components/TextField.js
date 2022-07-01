import { styled } from '../stitches.config';

/* * */
/* TEXT FIELD */
/* Explanation needed. */
/* * */

/* * */
/* STYLES */

const Label = styled('div', {
  fontSize: '12px',
  textTransform: 'uppercase',
  fontWeight: '$medium',
  color: '$gray10',
  borderBottomWidth: '$md',
  borderBottomStyle: 'solid',
  borderBottomColor: '$gray7',
  padding: '7px',
});

const Input = styled('input', {
  border: 'none',
  outline: 'none',
  fontSize: '18px',
  fontWeight: '$regular',
  padding: '7px',
  paddingTop: '5px',
});

const Error = styled('div', {
  fontSize: '12px',
  textTransform: 'uppercase',
  fontWeight: '$medium',
  color: '$gray0',
  backgroundColor: '$warning5',
  padding: '7px',
});

const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
  borderWidth: '$md',
  borderStyle: 'solid',
  borderColor: '$gray7',
  borderRadius: '$md',
  variants: {
    isError: {
      true: {
        borderColor: '$warning5',
        [`& ${Label}`]: {
          color: '$warning5',
          borderBottomColor: '$warning5',
        },
      },
    },
  },
});

export default function TextField({ label, error, ...props }) {
  //
  return (
    <>
      <Container isError={error ? true : false}>
        {label && <Label>{label}</Label>}
        <Input {...props} />
        {error && <Error>{error}</Error>}
      </Container>
    </>
  );
}
