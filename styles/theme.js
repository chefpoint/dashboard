import { createTheme } from '@nextui-org/react';

export const lightTheme = createTheme({
  type: 'light',
  theme: {
    fonts: {
      sans: "'work-sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;",
      mono: "Menlo, Monaco, 'Lucida Console', 'Liberation Mono', 'DejaVu Sans Mono', 'Bitstream Vera Sans Mono'",
    },
    fontWeights: {
      medium: 600,
    },
    shadows: {
      md: '0 2px 5px 0 rgba(0, 0, 0, 0.1)',
    },
    radii: {
      md: '8px',
      lg: '8px',
    },
    zIndices: {
      1: '0',
      2: '0',
      3: '0',
      4: '0',
      5: '0',
      10: '0',
      max: '8888',
    },
    colors: {
      // Brand
      muted: '#d2d2d2',
      // primaryLight: '$blue200',
      // primaryLightHover: '$blue300', // commonly used on hover state
      // primaryLightActive: '$blue400', // commonly used on pressed state
      // primaryLightContrast: '$blue600', // commonly used for text inside the component
      // primary: '$blue600',
      // primaryBorder: '$blue500',
      // primaryBorderHover: '$blue600',
      // primarySolidHover: '$blue700',
      // primarySolidContrast: '$white', // commonly used for text inside the component
      // primaryShadow: '$blue500',
      // Recipe types
      vegan: '#41b447',
      fish: '#0096ff',
      meat: '#a04b00',
    },
  },
});

export const darkTheme = createTheme({
  type: 'dark',
  theme: {
    // colors: {
    //   // brand colors
    //   // primaryLight: '$green200',
    //   // primaryLightHover: '$green300',
    //   // primaryLightActive: '$green400',
    //   // primaryLightContrast: '$green600',
    //   // primary: '#4ADE7B',
    //   // primaryBorder: '$green500',
    //   // primaryBorderHover: '$green600',
    //   // primarySolidHover: '$green700',
    //   // primarySolidContrast: '$white',
    //   // primaryShadow: '$green500',

    //   gradient: 'linear-gradient(112deg, $blue100 -25%, $pink500 -10%, $purple500 80%)',
    //   link: '#5E1DAD',
    // },
    space: {},
    fonts: {
      sans: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;",
      mono: "Menlo, Monaco, 'Lucida Console', 'Liberation Mono', 'DejaVu Sans Mono', 'Bitstream Vera Sans Mono'",
    },
  },
});
