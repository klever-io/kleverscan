const darktheme = {
  dark: true,
  background: '#030307',
  white: '#0B0B1E',
  black: '#ccc',
  borderLogo: '#ccc',

  border: '#eeeff6', // TODO: outdated

  rose: '#EE3F71', // TODO: outdated
  purple: '#7D3FF1', // TODO: outdated
  gray: '#EBEBEB', // TODO: outdated
  error: '#9E1313',

  true: {
    white: '#fff',
    black: '#0B0B1E',
  },
  status: {
    done: '#58925A',
    error: '#AA4247',
    pending: '#9D9932',
  },

  form: {
    background: '#FFFFFF',
    sectionTitle: '#7B7DB2',
    hash: '#4b4d80',
    hoverHash: '#6E7099',
  },

  navbar: {
    background: '#0B0B1E',

    text: '#646693',

    mobile: '#66688f', // TODO: outdated
    mobileContainer: '#25253a', // TODO: outdated
  },

  footer: {
    background: '#0B0B1E',

    socialBorder: '#2c3041',

    hover: '#aa33b5',
    text: '#9b9dd1',
  },

  input: {
    border: {
      default: '#C6C7EB',
      dark: '#7B7DB2',
      home: '#585a92',
    },

    text: '#7B7DB2',

    shadow: '#aa33b5',

    placeholder: '#9c9eb9', // TODO: outdated
    activeShadow: '#7418c2', // TODO: outdated
    activeBorder: '#ee3f71', // TODO: outdated
    error:
      'linear-gradient(95deg, rgb(205, 52, 87), rgb(255, 68, 101), rgb(255, 68, 101))', // TODO: outdated
  },

  card: {
    background: '#222345',

    text: '#C6C7EB',
    secondaryText: '#595C98',
    darkText: '#7B7DB2',

    border: '#7B7DB2',

    green: '#86EF75',
    red: '#FF4465',

    assetText: '#27284E',

    white: '#ccc',
    black: '#0B0B1E',
  },

  blockCard: {
    text: '#7B7DB2',
  },

  transactionCard: {
    text: '#7B7DB2',

    amount: '#595C98',
  },

  accountCard: {
    frozenBackground: '#222345',
  },

  chart: {
    darkBg: '#5A2A73',
    lightBg: '#aa33b5',
    transparent: '#272349',

    linear: {
      stroke: '#aa33b5',
      fill: '#585A92',
    },

    line: '#DDDEE7', // TODO: outdated
  },

  filter: {
    title: '#7B7DB2',
    titleFocused: '#FFFFFF',

    border: '#C6C7EB',
    text: '#4F5185',

    item: {
      background: '#C6C7EB',
      text: '#595C98',
      selected: '#aa33b5',
    },
  },

  tab: {
    indicator: '#aa33b5',
  },

  text: {
    black: '#2e2f47',
    background: 'linear-gradient(104deg, rgb(238, 63, 113), rgb(125, 63, 241))',
    largeBackground:
      'linear-gradient(104deg, rgb(238, 63, 113), rgb(125, 63, 241), rgb(125, 63, 241), rgb(238, 63, 113))',
  },

  table: {
    text: '#7B7DB2',

    success: '#37DD72',
    pending: '#FFB342',
    fail: '#FF4465',

    // TODO: outdated
    shadow: '#DDDEE7',

    link: '#8B46A7',

    icon: '#9c9eb9',

    green: '#32D46C',
    red: '#FF4465',

    energy: 'linear-gradient(132.3deg, #33D46C 0%, #D3F13F 123.14%);',

    helpIcon: '#9e9e9e',
  },

  pagination: {
    active: '#7D3FF1',
  },

  content: {
    // TODO: outdated
    tab: {
      active: '#2D2E47',
      inactive: '#9C9EB9',
    },

    divider: '#EEEFF6',
  },

  button: {
    // TODO: outdated
    background: 'linear-gradient(132deg, rgb(238, 63, 113), rgb(125, 63, 241))',
  },

  map: {
    // TODO: outdated
    marker: '#33d46c',
  },

  dateFilter: {
    outsideBackground: 'rgba(198, 199, 235, 0.2)',
  },
};

export default darktheme;
