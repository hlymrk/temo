import { createTheme } from '@mui/material/styles';

export const tempoTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: 'hsl(14, 85%, 55%)', // Sunset Orange
      contrastText: '#fff',
    },
    secondary: {
      main: 'hsl(220, 30%, 20%)', // Midnight Navy
      contrastText: '#fff',
    },
    success: {
      main: 'hsl(156, 45%, 40%)', // Emerald Green (for bank transfers)
    },
    background: {
      default: 'hsl(30, 20%, 98%)', // Warm Linen
      paper: '#fff',
    },
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          minHeight: '44px', // Mobile touch target
          minWidth: '44px',
          textTransform: 'none',
          borderRadius: '8px',
          fontWeight: 600,
        },
      },
    },
  },
});
