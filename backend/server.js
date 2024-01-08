// #region Importy bibliotek
const express = require('express');
const fs = require('fs');
const http = require('http');
const https = require('https');
const cors = require('cors')
const cookieParser = require('cookie-parser')
const mysql = require('mysql');
require('dotenv').config();
const rateLimit = require('express-rate-limit');
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

// #region Połączenie z bazą danych MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'praca_inzynierska'
});
connection.connect();
connection.query('SELECT * FROM user', (err, rows, fields) => {
  if (err) throw err
  console.log("Lista użytkowników w bazie:");
  rows.forEach(row => {
    console.log(JSON.parse(JSON.stringify(row)));
  });
})
connection.end();
// #endregion

// #region Konfiguracja aplikacji Express
const app = express();
const privateKey = fs.readFileSync('cert/key.pem', 'utf8');
const certificate = fs.readFileSync('cert/cert.pem', 'utf8');
const ssl = {
  key: privateKey,
  cert: certificate
}
const limiter = rateLimit({
	windowMs: 60 * 1000,
	limit: 20,
	standardHeaders: 'draft-7',
	legacyHeaders: false,
})

app.use(cors({
  origin: [CLIENT_URL_HTTP, CLIENT_URL_HTTPS],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(limiter)
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