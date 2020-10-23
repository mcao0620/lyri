import { createMuiTheme } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";

export const lighttheme = createMuiTheme({
  palette: {
    primary: {
      main: "#26292C",
      light: "rgb(81, 91, 95)",
      dark: "rgb(26, 35, 39)",
      contrastText: "#ffffff",
    },
    secondary: {
      light: "#b1f9b3",
      main: "#80c683",
      dark: "#509556",
      contrastText: "#000",
    },
  },
});

export const darktheme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#26292C",
      light: "rgb(81, 91, 95)",
      dark: "rgb(26, 35, 39)",
      contrastText: "#ffffff",
    },
    secondary: {
      light: "#b1f9b3",
      main: "#80c683",
      dark: "#509556",
      contrastText: "#000",
    },
    titleBar: {
      main: "#555555",
      contrastText: "#ffffff",
    },
    error: {
      main: red.A400,
    },
  },
});
