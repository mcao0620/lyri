import React from "react";
import {
  AppBar,
  Button,
  CssBaseline,
  Grid,
  Toolbar,
  Typography,
  Container,
  Link,
  ThemeProvider,
} from "@material-ui/core";
import { lighttheme, darktheme } from "./theme";
import { makeStyles } from "@material-ui/core/styles";
import { MemoryRouter as Router } from "react-router";
import { Link as RouterLink } from "react-router-dom";

const Footer = () => (
  <Typography variant="body2" color="textSecondary" align="center">
    {"source code can be found at: "}
    <Typography variant="body2" color="secondary">
      http://github.com/mcao0620
    </Typography>
  </Typography>
);

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  cardMedia: {
    paddingTop: "56.25%", // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    padding: theme.spacing(6),
  },
}));

const App = () => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <ThemeProvider theme={darktheme}>
        <CssBaseline />
        <AppBar position="relavitve">
          <Toolbar>
            <Typography variant="h6" color="inherit" noWrap>
              lyri
            </Typography>
          </Toolbar>
        </AppBar>
        <main>
          <div className={classes.heroContent}>
            <Container maxWidth="sm">
              <Typography
                component="h1"
                variant="h2"
                align="center"
                color="textPrimary"
                gutterBottom
              >
                Real Time Spotify Lyrics
              </Typography>
              <Typography
                variant="h5"
                align="center"
                color="textSecondary"
                paragraph
              >
                Ever wished that you had side-by-side lyrics for your currently
                playing Spotify song? Lyri syncs directly with your Spotify
                account and fetches song lyrics from Musixmatch, a popular
                lyrics platform.
              </Typography>
              <div className={classes.heroButtons}>
                <Grid container spacing={2} justify="center">
                  <Grid item>
                    <Router>
                      <Link href="/login">
                        <Button variant="contained" color="secondary">
                          Get Started
                        </Button>
                      </Link>
                    </Router>
                  </Grid>
                </Grid>
              </div>
            </Container>
          </div>
        </main>
        <footer className={classes.footer}>
          <Typography variant="h6" align="center" gutterBottom>
            lyri
          </Typography>
          <Typography
            variant="subtitle1"
            align="center"
            color="textSecondary"
            component="p"
          >
            open source project created by michael cao
          </Typography>
          <Footer />
        </footer>
      </ThemeProvider>
    </React.Fragment>
  );
};

export default App;
