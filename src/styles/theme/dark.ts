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
