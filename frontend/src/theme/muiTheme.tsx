import { createTheme } from '@mui/material/styles'
import { green, lime, teal } from '@mui/material/colors'

const theme = createTheme({
  shape: {
    borderRadius: 18
  },
  palette: {
    mode: 'light',
    primary: {
      main: green[700],
      light: green[500],
      dark: green[900],
      contrastText: '#ffffff'
    },
    secondary: {
      main: teal[500],
      light: teal[300],
      dark: teal[700]
    },
    success: {
      main: lime[700]
    },
    background: {
      default: '#f4fbf5',
      paper: '#ffffff'
    },
    text: {
      primary: '#16311f',
      secondary: '#4b6b55'
    }
  },
  typography: {
    fontFamily: ['Inter', 'system-ui', 'sans-serif'].join(','),
    h3: {
      fontWeight: 800,
      letterSpacing: '-0.03em'
    },
    h4: {
      fontWeight: 800,
      letterSpacing: '-0.03em'
    },
    h5: {
      fontWeight: 700,
      letterSpacing: '-0.02em'
    },
    h6: {
      fontWeight: 700
    },
    button: {
      textTransform: 'none',
      fontWeight: 700
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          boxShadow: 'none'
        }
      }
    },
    MuiTextField: {
      defaultProps: {
        size: 'small'
      }
    },
    MuiSelect: {
      defaultProps: {
        size: 'small'
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          border: '1px solid rgba(22, 49, 31, 0.08)',
          boxShadow: '0 20px 50px rgba(22, 49, 31, 0.08)'
        }
      }
    }
  }
})

export default theme
