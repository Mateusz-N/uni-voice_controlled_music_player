// #region Importy bibliotek
const express = require('express');
const fs = require('fs');
const http = require('http');
const https = require('https');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
// #endregion

// #region Importy plików
const spotifyRouter = require('./routes/spotify');
const discogsRouter = require('./routes/discogs');
const musixmatchRouter = require('./routes/musixmatch');
// #endregion

// #region Zmienne środowiskowe
const SERVER_PORT_HTTP = process.env.SERVER_PORT_HTTP || 3030;
const SERVER_PORT_HTTPS = process.env.SERVER_PORT_HTTPS || 3060;
const CLIENT_PORT = process.env.CLIENT_PORT || 3000;
const CLIENT_URL_HTTP = process.env.CLIENT_URL_HTTP || `http://localhost:${CLIENT_PORT}`;
const CLIENT_URL_HTTPS = process.env.CLIENT_URL_HTTPS || `https://localhost:${CLIENT_PORT}`;
// #endregion

// #region Konfiguracja aplikacji Express
const app = express();
const privateKey = fs.readFileSync('cert/key.pem', 'utf8');
const certificate = fs.readFileSync('cert/cert.pem', 'utf8');
const ssl = {
  key: privateKey,
  cert: certificate
}

app.use(cors({
  origin: [CLIENT_URL_HTTP, CLIENT_URL_HTTPS],
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(cookieParser());
app.use('/spotify', spotifyRouter);
app.use('/discogs', discogsRouter);
app.use('/musixmatch', musixmatchRouter);

const serverHTTP = http.createServer(app);
const serverHTTPS = https.createServer(ssl, app);

serverHTTP.listen(SERVER_PORT_HTTP, () => {
  console.log(`Serwer HTTP nasłuchuje na porcie ${SERVER_PORT_HTTP}`);
})
serverHTTPS.listen(SERVER_PORT_HTTPS, () => {
  console.log(`Serwer HTTPS nasłuchuje na porcie ${SERVER_PORT_HTTPS}`);
})
// #endregion