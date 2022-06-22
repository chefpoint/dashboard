import { styled } from '../stitches.config';

export default styled('button', {
  //
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  //
  // width: '100%',
  padding: '$md $lg',
  borderWidth: '2px',
  borderStyle: 'solid',
  borderRadius: '$md',
  //
  fontSize: '25px',
  fontWeight: '$bold',
  textTransform: 'uppercase',
  //
  transition: '$default',
  cursor: 'pointer',
  //
  variants: {
    color: {
      primary: {
        color: '$gray0',
        backgroundColor: '$primary5',
        borderColor: '$primary6',
        '&:active': {
          color: '$primary9',
          backgroundColor: '$primary6',
          borderColor: '$primary9',
          boxShadow: '$sm',
        },
      },
      secondary: {
        color: '$gray11',
        backgroundColor: '$gray3',
        borderColor: '$gray7',
        '&:active': {
          color: '$gray12',
          backgroundColor: '$gray8',
          borderColor: '$gray9',
          boxShadow: '$sm',
        },
      },
      success: {
        color: '$gray0',
        backgroundColor: '$success5',
        borderColor: '$success6',
        '&:active': {
          color: '$success9',
          backgroundColor: '$success6',
          borderColor: '$success9',
          boxShadow: '$sm',
        },
      },
      warning: {
        color: '$gray0',
        backgroundColor: '$warning5',
        borderColor: '$warning6',
        '&:active': {
          color: '$warning9',
          backgroundColor: '$warning6',
          borderColor: '$warning9',
          boxShadow: '$sm',
        },
      },
      danger: {
        color: '$gray0',
        backgroundColor: '$danger5',
        borderColor: '$danger6',
        '&:active': {
          color: '$danger9',
          backgroundColor: '$danger6',
          borderColor: '$danger9',
          boxShadow: '$sm',
        },
      },
    },
  },
  //
  '&[disabled]': {
    cursor: 'not-allowed',
    color: '$gray6',
    backgroundColor: '$gray2',
    borderColor: '$gray4',
    boxShadow: 'none',
    '&:active': {
      color: '$gray6',
      backgroundColor: '$gray2',
      borderColor: '$gray4',
      boxShadow: 'none',
    },
  },
  //
  defaultVariants: {
    color: 'primary',
  },
});
