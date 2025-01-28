
# Foozle Radio

The foozle radio is a quick Vue3 and Express/Node.js app that allows
a user to put a contry and get 20000 radio station that can be filtered.
It attempts to download album art and track meta data; it does this using web sockets.
It also trys to get the current song's streamed progress.

This is not an overall complex build and you can learn how some of the more advanced 
logic works by the unit tests; AVA for the backend tests and ViTest for the frontEnd tests.

## Configuration
You will either need to get a https certificate (Let's Encrypt) or generate a local cert and place the certs in the /backend/bin folder named localhost.crt, localhost.csr, and localhost.key; otherwise you will need to update where you store certs in file /backend/server.js and frontend's  vite.config.js

You will need to register for a Spotify developer account and get a security hash so that you can authenticate with spotify and use their apis. More [information here](https://developer.spotify.com/documentation/web-api)

## Installation

```bash
# Example
# Pull this down to a local or server directory named something like radio
git clone git@github.com:foozlereducer/foozle-radio-player.git
# We are now in the root of the git directory
# Change to the backend directory
cd backend
npm install
# After npm installs dependencies, start the node app
npm start
# Change to the frontend directory
../frontend
npm install
# After npm installs dependencies, start the Vue3 app
npm run dev
```

## Somewhat Technical Info
- Song's meta data is sent through web sockets in the front and backend; this is albumn art, track meta data and track progress 
- The web socket servers are in ./backend/bin/wss.js and in ./frontend/src/components/AudioControls.vue
- Run tests:
```BASH
cd ./backend
npm run test

# Front End tests coming soon

