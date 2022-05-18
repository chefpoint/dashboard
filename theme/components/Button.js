import { styled } from '../../stitches.config';

export default styled('button', {
  borderWidth: '$md',
  borderStyle: 'solid',
  borderRadius: '$md',
  fontSize: '$md',
  padding: '5px 20px',
  fontWeight: '800',
  textTransform: 'uppercase',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  transition: 'all 200ms ease',
  cursor: 'pointer',
  variants: {
    color: {
      primary: {
        color: '$gray1',
        backgroundColor: '$primary5',
        borderColor: '$primary6',
        '&:hover': {
          backgroundColor: '$primary6',
          borderColor: '$primary7',
          boxShadow: '$hover',
        },
        '&:active': {
          backgroundColor: '$primary7',
          borderColor: '$primary9',
        },
      },
      secondary: {
        color: '$gray11',
        backgroundColor: '$gray3',
        borderColor: '$gray7',
        '&:hover': {
          borderColor: '$gray8',
        },
        '&:active': {
          backgroundColor: '$gray5',
          borderColor: '$gray7',
        },
      },
      disabled: {
        cursor: 'not-allowed',
        color: '$gray8',
        backgroundColor: '$gray2',
        borderColor: '$gray5',
      },
      success: {
        color: '$gray1',
        backgroundColor: '$success5',
        borderColor: '$success6',
        '&:hover': {
          borderColor: '$success8',
        },
        '&:active': {
          backgroundColor: '$success4',
          borderColor: '$success6',
        },
      },
      warning: {
        color: '$warning9',
        backgroundColor: '$warning5',
        borderColor: '$warning6',
        '&:hover': {
          borderColor: '$warning8',
        },
        '&:active': {
          backgroundColor: '$warning4',
          borderColor: '$warning6',
        },
      },
      danger: {
        color: '$gray1',
        backgroundColor: '$danger5',
        borderColor: '$danger6',
        '&:hover': {
          borderColor: '$danger8',
        },
        '&:active': {
          backgroundColor: '$danger6',
          borderColor: '$danger8',
        },
      },
    },
  },
  defaultVariants: {
    color: 'primary',
  },
});
