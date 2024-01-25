// #region Importy bibliotek
const express = require('express');
const fs = require('fs');
const http = require('http');
const https = require('https');
const socketIO = require('socket.io');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const rateLimit = require('express-rate-limit');
// #endregion

// #region Importy plików
const spotifyRouter = require('./routes/spotify');
const discogsRouter = require('./routes/discogs');
const lrclibRouter = require('./routes/lrclib');
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
const corsRules = {
  origin: [CLIENT_URL_HTTP, CLIENT_URL_HTTPS],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}
const limiter = rateLimit({
	windowMs: 60 * 1000,
	limit: 100,
	standardHeaders: 'draft-7',
	legacyHeaders: false,
});

app.use(cors(corsRules));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(limiter)
app.use('/spotify', spotifyRouter);
app.use('/discogs', discogsRouter);
app.use('/lrclib', lrclibRouter);

const serverHTTP = http.createServer(app);
const serverHTTPS = https.createServer(ssl, app);
const io = socketIO(serverHTTPS, {
  cors: corsRules
});

/* Punkt końcowy obsługujący komendy głosowe z aplikacji mobilnej i emitujący je dalej do klienta aplikacji przeglądarkowej */
app.post('/remote-voice-command', (req, res) => {
  const { command } = req.body;
  io.emit('voice-command', command);
  res.json({ success: true });
});
app.get

serverHTTP.listen(SERVER_PORT_HTTP, () => {
  console.log(`Serwer HTTP nasłuchuje na porcie ${SERVER_PORT_HTTP}`);
})
serverHTTPS.listen(SERVER_PORT_HTTPS, () => {
  console.log(`Serwer HTTPS nasłuchuje na porcie ${SERVER_PORT_HTTPS}`);
})
// #endregion