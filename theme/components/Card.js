import { styled } from '../../stitches.config';

export default styled('div', {
  borderRadius: '$md',
  fontSize: '$md',
  padding: '20px',
  fontWeight: '800',
  textTransform: 'uppercase',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  boxShadow: '$md',
  variants: {
    color: {
      primary: {
        color: '$gray6',
        backgroundColor: '$gray1',
      },
    },
  },
  defaultVariants: {
    color: 'primary',
  },
});
