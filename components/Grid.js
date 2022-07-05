import { styled } from '@stitches/react';

/* * */
/* LABEL */
/* Explanation needed. */
/* * */

export const Label = styled('p', {
  fontSize: '12px',
  fontWeight: '$medium',
  textTransform: 'uppercase',
  color: '$gray11',
});

/* * */
/* VALUE */
/* Explanation needed. */
/* * */

export const Value = styled('p', {
  fontSize: '18px',
  fontWeight: '$medium',
  color: '$gray12',
});

/* * */
/* GRID CELL */
/* Explanation needed. */
/* * */

export const GridCell = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  padding: '$md',
  borderRadius: '$md',
  backgroundColor: '$gray1',
  gap: '$xs',
  variants: {
    clickable: {
      true: {
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: '$gray4',
        },
      },
    },
  },
});

/* * */
/* GRID */
/* Explanation needed. */
/* * */

export const Grid = styled('div', {
  display: 'grid',
  borderRadius: '$md',
  gap: '$md',
  alignItems: 'center',
  variants: {
    clickable: {
      true: {
        cursor: 'pointer',
        '&:hover': {
          borderColor: '$gray7',
          backgroundColor: '$gray4',
          [`& ${GridCell}`]: {
            backgroundColor: 'transparent',
          },
        },
      },
    },
    layout: {
      auto: {
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      },
      iconRight: {
        gridTemplateColumns: '1fr  minmax(100px, 5%)',
      },
    },
  },
  defaultVariants: {
    layout: 'auto',
  },
});
