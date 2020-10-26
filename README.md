## lyri - Lyrics App for Spotify

Ever wished that you had side-by-side lyrics for your currently
playing Spotify song? lyri syncs directly with your Spotify
account and fetches song lyrics from Genius, a popular
lyrics platform.

lyri is a cross-platform Electron app made with React and Node.js.

## Features:

- Direct Spotify authentication and syncing
- Lyrics fetched in real-time from Genius or Musixmatch
- Auto-scrolls lyrics based on where you are in the song

## Usage Instructions:

1. Create a Spotify Application at https://developer.spotify.com/
2. Replace client_secret and client_id in src/webServer.js with your own Spotify app credentials
3. If necessary, replace the genius_access_token with your own; you can get one from https://docs.genius.com/
4. Run `npm start` and `npm run electron` to start the app! You'll be redirected to log into your Spotify account, and then you're all set!

## Screenshots

![Lyri-Usage](public/lyriusage.png)
