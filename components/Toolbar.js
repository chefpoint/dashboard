import { styled } from '../stitches.config';

export default styled('div', {
  display: 'grid',
  placeItems: 'stretch',
  placeContent: 'stretch',
  gap: '$md',
  variants: {
    cols: {
      1: {
        gridTemplateColumns: '1fr',
      },
      2: {
        gridTemplateColumns: '1fr 1fr',
      },
      3: {
        gridTemplateColumns: '1fr 1fr 1fr',
      },
      asymmetric: {
        gridTemplateColumns: '3fr minmax(35%, 1fr)',
      },
      auto: {
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      },
    },
  },
  defaultVariants: {
    cols: 'asymmetric',
  },
});
