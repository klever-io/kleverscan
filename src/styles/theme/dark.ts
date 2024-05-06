import theme from '.';

const darktheme = {
  ...theme,
  dark: true,
  background: '#06060B',
  white: '#181935',
  black: '#FFFF',
  gray700: '#B7BDC6',
  darkText: '#C6C7EB',

  black10: 'rgba(255, 255, 255, 0.1)',

  legacy: {
    ...theme.legacy,
    background: '#0B0B1E',
  },

  form: {
    ...theme.form,
    hoverHash: '#6E7099',
  },

  chart: {
    darkBg: '#5A2A73',
    lightBg: '#AA33B5',
    backgroundTooltip: 'rgb(255, 255, 255, 0.8)',
  },
  line: {
    border: '#646693',
  },

  table: {
    ...theme.table,
    background: '#0b0b10',
  },

  input: {
    ...theme.input,
    activeShadow: '#ee3f71',
  },

  navbar: {
    ...theme.navbar,
    background: '#0B0B1E',
  },

  filter: {
    ...theme.filter,
    signersPermission: '#2a2b54',
  },

  card: {
    ...theme.card,
    border: '#515395',
    white: '#ccc',
    green: '#86EF75',
    red: '#FF4465',
  },

  modalBackground: {
    background: '#222345',
    title: 'linear-gradient(104deg, rgb(238, 63, 113), rgb(125, 63, 241))',
  },

  qrcodeTooltip: {
    background: '#222345',
  },

  circleBackground: {
    light: '#222345',
  },
  footer: {
    ...theme.footer,
    background: '#06060B',
  },

  accountCard: {
    frozenBackground: '#222345',
    cardStaking: '#4b4d80',
  },

  wizard: {
    ...theme.wizard,
    background: '#06060b',
    subTitle: '#c6c7eb',
    genericInfoCard:
      'linear-gradient(180deg, rgba(34, 35, 69, 0.5) 0%, rgba(34, 35, 69, 0) 100%)',
    steps: '#fff',
    stepsBackground: 'rgba(24, 25, 53, 0.5)',
    stepsLine: '#646693',
    cardAddress: '#222345',
  },

  warning: {
    background: '#95865188',
    text: '#eb9c27',
  },
};
export default darktheme;
