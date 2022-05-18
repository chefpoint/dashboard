import { styled } from '../../stitches.config';

export default styled('div', {
  fontSize: '$lg',
  fontWeight: '800',
  textTransform: 'uppercase',
  variants: {
    color: {
      primary: {
        color: '$gray12',
      },
    },
  },
  defaultVariants: {
    color: 'primary',
  },
});
