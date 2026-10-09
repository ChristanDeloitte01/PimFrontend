import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    background: {
      default: "#f5f6f8",
    },
  },

  typography: {
    fontFamily: "Arial, Helvetica, sans-serif",

    h4: {
      fontWeight: 600,
    },

    h5: {
      fontWeight: 600,
    },
  },

  shape: {
    borderRadius: 4,
  },

  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          border: "1px solid #e0e0e0",
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          backgroundColor: "#f5f5f5",
        },
      },
    },
  },
});

export default theme;