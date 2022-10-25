import theme from '.';

const darktheme = {
  ...theme,
  dark: true,
  background: '#030307',
  white: '#0B0B1E',
  black: '#ccc',

  form: {
    ...theme.form,
    hoverHash: '#6E7099',
  },

  chart: {
    darkBg: '#5A2A73',
    lightBg: '#aa33b5',
    backgroundTooltip: 'rgb(255, 255, 255, 0.8)',
  },

  input: {
    ...theme.input,
    activeShadow: '#ee3f71',
  },

  card: {
    ...theme.card,
    border: '#7B7DB2',
    white: '#ccc',
  },

  accountCard: {
    frozenBackground: '#222345',
  },
};
export default darktheme;
