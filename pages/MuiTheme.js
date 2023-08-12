import { createTheme } from '@mui/material';
import { themes } from '../components/themes/themes';

function MuiTheme ({ ...props }) {
  const { selectedTheme, fontSize } = props;

  const sizes = {
    xs: 10,
    sm: 12,
    md: 14,
    xl: 18,
    xxl: 22,
    titlexs: 24,
    title: 28,
    titlexxl: 32,
  };

  const colorScheme = themes[selectedTheme];

  const theme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: colorScheme.primary.main,
        dark: colorScheme.primary.dark,
        light: colorScheme.primary.light,
        lightest: colorScheme.primary.lightest,
      },
      default: {
        main: '#fff',
        sides: colorScheme.primary.dark,
      },
      lightGray: {
        main: 'var(--grayBG)',
        edges: '#EDEDED',
        secondary: '#FAFAFA'
      },
      lightTextSm: {
        main: '#8c8c8c',
        black: 'black',
        dark: 'black',
      },
      link: {
        main: colorScheme.primary.main,
      },
      messages: {
        sender: colorScheme.primary.main,
        receiver: '#E4E6EB',
      }
    },
    //  Muda a shape de todos os obj incluido inputs
    // shape: {
    //     borderRadius: '8px'
    // },
    typography: {
      fontFamily: 'Montserrat',
      fontSize: sizes[fontSize],
      xs: { fontSize: sizes.xs },
      sm: { fontSize: sizes.sm },
      md: { fontSize: sizes.md },
      xl: { fontSize: sizes.xl },
      xxl: { fontSize: sizes.xxl },
      title: { fontSize: sizes.title, fontWeight: 'bold' },
      titlexs: { fontSize: sizes.titlexs, fontWeight: 'bold' },
      titlexxl: { fontSize: sizes.titlexxl, fontWeight: 'bold' },
    },
    TextareaAutosize: {
      fontFamily: 'Montserrat',
      backgroundColor: 'white',
    },
    components: {
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            backgroundColor: 'white',
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          root: {
            backgroundColor: 'white',
          },
        },
      },
      MuiAutocomplete: {
        styleOverrides: {
          root: {
            backgroundColor: 'white',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
          },
        },
      },
      MuiGrid: {
        styleOverrides: {
          root: {
            width: '100%'
          }
        }
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            backgroundColor: 'var(--grayBG)'
          }
        }
      },
      MuiTextareaAutosize: {
        styleOverrides: {
          root: {
            backgroundColor: 'white',
          }
        }
      },
    },
    transitions: {
      duration: {
        shortest: 150,
        shorter: 200,
        short: 250,
        // most basic recommended timing
        standard: 300,
        // this is to be used in complex animations
        complex: 375,
        // recommended when something is entering screen
        enteringScreen: 225,
        // recommended when something is leaving screen
        leavingScreen: 195,
      },
    },
  });

  return { ...theme };
}

export default MuiTheme;
