const express = require('express');
const app = express();
const cors = require('cors')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const crypto = require('crypto');

const { SERVER_PORT, CLIENT_PORT } = require('./config');

const spotifyRouter = require('./routes/spotify');
const discogsRouter = require('./routes/discogs');
const musixmatchRouter = require('./routes/musixmatch');

const mysql = require('mysql');
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

app.use(cors({
  origin: [`http://localhost:${CLIENT_PORT}`],
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(cookieParser());
app.use(session({
  key: 'auth',
  secret: crypto.randomBytes(64).toString('hex'),
  resave: false,
  saveUninitialized: true,
  accessToken: null,
  userName: null,
  userProfilePicURL: null,
  cookie: {
    expires: 24 * 60 * 60 * 1000
  }
}));
app.use('/spotify', spotifyRouter);
app.use('/discogs', discogsRouter);
app.use('/musixmatch', musixmatchRouter);

app.listen(SERVER_PORT, () => {
  console.log(`Aplikacja nasłuchuje na porcie ${SERVER_PORT}`);
})