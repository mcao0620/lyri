var express = require("express"); // Express web server framework
var request = require("request"); // "Request" library
var cors = require("cors");
var querystring = require("querystring");
var cookieParser = require("cookie-parser");
var cheerio = require("cheerio");
var similartext = require("./similartext");
//const { AuthorizationCode } = require("simple-oauth2");

var client_id = "876302cfb8514ff187ce1be0d3558a2b"; // Your client id
var redirect_uri = "http://localhost:8888/callback"; // Your redirect uri
var app_uri = "http://localhost:3000/";

var musixmatch_id = "704afe99d0005ef37412706ae2ee8ddb";

var genius_access_token =
  "h6eBldhirI624K7Nbtp4Y0oBtAVnDLidSOv0OwAmCqh4eFDXtbW6PxPJgJvLLeeb";

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function (length) {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = "spotify_auth_state";

var app = express();

app
  .use(express.static(__dirname + "/public"))
  .use(cors())
  .use(cookieParser());

// const geniusClient = new AuthorizationCode({
//   client: {
//     id: "",
//     secret:
//       "",
//   },
//   auth: {
//     tokenHost: "https://api.genius.com",
//     tokenPath: "/oauth/token",
//     authorizePath: "/oauth/authorize",
//   },
// });

// const geniusAuthorizationUri = geniusClient.authorizeURL({
//   redirect_uri: "http://localhost:8888/genius/callback",
//   scope: "me",
//   state: generateRandomString(16),
//   response_type: "code",
// });

// app.get("/genius/login", function (req, res) {
//   console.log(geniusAuthorizationUri);
//   res.redirect(geniusAuthorizationUri);
// });

// app.get("/genius/callback", async function (req, res) {
//   const { code } = req.query;
//   const options = {
//     code,
//     grant_type: "authorization_code",
//     client_id:
//       "",
//     client_secret:
//       "",
//     redirect_uri: app_uri,
//     response_type: "code",
//   };

//   try {
//     const token = await geniusClient.getToken(options);
//     console.log("token: ", token.token);
//   } catch (error) {
//     console.error("Access Token Error", error.message);
//     return res.status(500).json("Authentication failed");
//   }
// });

app.get("/login", function (req, res) {
  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  var scope = "user-read-currently-playing user-read-playback-state";
  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state,
      })
  );
});

app.get("/callback", function (req, res) {
  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect(
      "/#" +
        querystring.stringify({
          error: "state_mismatch",
        })
    );
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: "https://accounts.spotify.com/api/token",
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: "authorization_code",
      },
      headers: {
        Authorization:
          "Basic " +
          new Buffer(client_id + ":" + client_secret).toString("base64"),
      },
      json: true,
    };

    request.post(authOptions, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        var access_token = body.access_token,
          refresh_token = body.refresh_token;

        var options = {
          url: "https://api.spotify.com/v1/me",
          headers: { Authorization: "Bearer " + access_token },
          json: true,
        };

        res.redirect(
          app_uri +
            "#" +
            querystring.stringify({
              access_token: access_token,
              refresh_token: refresh_token,
            })
        );
      } else {
        res.redirect(
          app_uri +
            querystring.stringify({
              error: "invalid_token",
            })
        );
      }
    });
  }
});

app.get("/refresh_token", function (req, res) {
  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: "https://accounts.spotify.com/api/token",
    headers: {
      Authorization:
        "Basic " +
        new Buffer(client_id + ":" + client_secret).toString("base64"),
    },
    form: {
      grant_type: "refresh_token",
      refresh_token: refresh_token,
    },
    json: true,
  };

  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        access_token: access_token,
      });
    } else {
      res.status(400).send();
    }
  });
});

app.get("/genius/lyrics", function (req, res) {
  const { artist } = req.query;
  let title = req.query.title;
  if (title.indexOf("(") !== -1) {
    title = title.slice(0, title.indexOf("("));
  }

  let trackSearchOptions = {
    url:
      "https://api.genius.com/search?" +
      querystring.stringify({
        q: artist + " " + title,
        access_token: genius_access_token,
      }),
  };

  console.log(trackSearchOptions.url);

  request.get(trackSearchOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      let data = JSON.parse(body);
      let path = "";
      let percent = 0;
      for (i = 0; i < data.response.hits.length; i++) {
        if (data.response.hits[i].type === "song") {
          if (path === "") {
            path = data.response.hits[i].result.path;
            percent = similartext.similartext(
              data.response.hits[i].result.title,
              title,
              true
            );
          } else {
            let tempPercent = similartext.similartext(
              data.response.hits[i].result.title,
              title,
              true
            );
            if (tempPercent > percent) {
              path = data.response.hits[i].result.path;
              percent = tempPercent;
            }
          }
        }
      }
      if (path !== "" && percent > 50) {
        let toScrape = {
          url: "https://genius.com" + path,
        };
        request(toScrape, function (error, response, body) {
          const $ = cheerio.load(body);
          let scrapedLyrics = "";
          $(".lyrics > p").each((_idx, el) => {
            scrapedLyrics += $(el).text();
          });
          res.send(scrapedLyrics);
        });
      } else {
        res.status(400).send();
      }
    }
  });
});

app.get("/lyrics", function (req, res) {
  const { title, artist } = req.query;

  let trackSearchOptions = {
    url:
      "https://api.musixmatch.com/ws/1.1/track.search?" +
      querystring.stringify({
        q_track: title,
        q_artist: artist,
        f_has_lyrics: 1,
        quorum_factor: 1,
        format: "json",
        apikey: musixmatch_id,
      }),
  };

  request.get(trackSearchOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      let data = JSON.parse(body);
      if (data.message.body.track_list.length > 0) {
        const { track_id } = data.message.body.track_list[0].track;

        let lyricsGetOptions = {
          url:
            "https://api.musixmatch.com/ws/1.1/track.lyrics.get?" +
            querystring.stringify({
              track_id: track_id,
              format: "json",
              apikey: musixmatch_id,
            }),
        };
        request.get(lyricsGetOptions, function (error, response, body) {
          if (!error && response.statusCode === 200) {
            let lyrics = JSON.parse(body).message.body.lyrics.lyrics_body;
            res.send(lyrics);
          } else {
            console.log(error);
          }
        });
      } else {
        res.status(400).send();
      }
    } else {
      console.log(error);
      res.status(400).send();
    }
  });
});

console.log("Listening on 8888");
app.listen(8888);
