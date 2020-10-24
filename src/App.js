import React, { useState, useEffect, useRef } from "react";
import {
  Avatar,
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
import axios from "axios";

const apiUrl = "http://localhost:8888";

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
  lyricsContent: {
    padding: theme.spacing(4, 0, 6),
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
  largeAvatar: {
    width: theme.spacing(5),
    height: theme.spacing(5),
  },
  title: {
    margin: theme.spacing(3),
  },
  lyriLogo: {
    flex: 1,
  },
}));

const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

const App = () => {
  const classes = useStyles();
  const [params, setParams] = useState({});
  const [profile, setProfile] = useState({});
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [timer, setTimer] = useState(null);
  const [lyrics, setLyrics] = useState("");
  const prevPlaying = usePrevious(currentlyPlaying);

  const getHashParams = () => {
    let hashParams = {};
    let e,
      r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
    while ((e = r.exec(q))) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  };

  useEffect(() => {
    let temp = getHashParams();
    setParams(temp);

    if (temp.access_token) {
      console.log("reached");

      axios
        .get("https://api.spotify.com/v1/me", {
          headers: { Authorization: "Bearer " + temp.access_token },
        })
        .then((res) => {
          console.log(res.data);
          setProfile(res.data);
        })
        .catch((err) => console.log(err));

      axios
        .get("https://api.spotify.com/v1/me/player/currently-playing", {
          headers: { Authorization: "Bearer " + temp.access_token },
        })
        .then((res) => {
          setCurrentlyPlaying(res.data);
          setLyrics("Loading Lyrics...");
          axios
            .get("http://localhost:8888/genius/lyrics", {
              params: {
                title: res.data.item.name,
                artist: res.data.item.artists[0].name,
              },
            })
            .then((lyrics) => {
              console.log(lyrics.data);
              setLyrics(lyrics.data);
            })
            .catch((err) => {
              console.log(err);
              setLyrics("No Lyrics Found!");
            });
        })
        .catch((err) => console.log(err));
      setTimer(
        setInterval(() => {
          axios
            .get("https://api.spotify.com/v1/me/player/currently-playing", {
              headers: { Authorization: "Bearer " + temp.access_token },
            })
            .then((res) => {
              setCurrentlyPlaying(res.data);
            })
            .catch((err) => console.log(err));
        }, 1000)
      );
      return clearInterval(timer);
    }
  }, []);

  useEffect(() => {
    if (
      prevPlaying &&
      currentlyPlaying &&
      prevPlaying.item.name !== currentlyPlaying.item.name
    ) {
      setLyrics("Loading Lyrics...");
      axios
        .get("http://localhost:8888/genius/lyrics", {
          params: {
            title: currentlyPlaying.item.name,
            artist: currentlyPlaying.item.artists[0].name,
          },
        })
        .then((lyrics) => {
          console.log(lyrics.data);
          setLyrics(lyrics.data);
        })
        .catch((err) => {
          console.log(err);
          setLyrics("No Lyrics Found!");
        });
    }
  }, [currentlyPlaying]);

  const Landing = (
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
        <Typography variant="h5" align="center" color="textSecondary" paragraph>
          Ever wished that you had side-by-side lyrics for your currently
          playing Spotify song? Lyri syncs directly with your Spotify account
          and fetches song lyrics from Genius, a popular lyrics platform.
        </Typography>
        <div className={classes.heroButtons}>
          <Grid container spacing={3} justify="center">
            <Grid item>
              <Router>
                <Link href="http://localhost:8888/login">
                  <Button
                    variant="contained"
                    color="secondary"
                    //onClick={login}
                  >
                    Get Started
                  </Button>
                </Link>
              </Router>
            </Grid>
          </Grid>
        </div>
      </Container>
    </div>
  );

  const Lyrics = (
    <div className={classes.lyricsContent}>
      <Container maxWidth="sm">
        <Typography variant="h5" align="center" color="textSecondary">
          Currently Playing:
        </Typography>
        <Typography
          variant="h6"
          align="center"
          color="secondary"
          className={classes.title}
        >
          {currentlyPlaying
            ? currentlyPlaying.item.name +
              " - " +
              currentlyPlaying.item.artists[0].name
            : "No Song Playing!"}
        </Typography>
        <Typography
          variant="body"
          color="textSecondary"
          style={{
            whiteSpace: "pre-line",
          }}
        >
          {lyrics}
        </Typography>
      </Container>
    </div>
  );

  return (
    <React.Fragment>
      <ThemeProvider theme={darktheme}>
        <CssBaseline />
        <AppBar position="relavitve">
          <Toolbar>
            <Typography
              variant="h6"
              color="inherit"
              noWrap
              className={classes.lyriLogo}
            >
              lyri
            </Typography>
            {params.access_token !== undefined && (
              <Grid container spacing={1} alignItems="center">
                <Grid item>
                  <Avatar
                    className={classes.largeAvatar}
                    src={
                      profile.images !== undefined ? profile.images[0].url : ""
                    }
                  />
                </Grid>
                <Grid item>
                  <Typography variant="h6" color="textSecondary">
                    {profile.display_name !== undefined
                      ? profile.display_name
                      : ""}
                  </Typography>
                </Grid>
              </Grid>
            )}
          </Toolbar>
        </AppBar>
        <main>{params.access_token === undefined ? Landing : Lyrics}</main>
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
