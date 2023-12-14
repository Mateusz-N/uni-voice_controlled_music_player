// #region Importy bibliotek
const express = require('express');
const cors = require('cors')
const cookieParser = require('cookie-parser')
const mysql = require('mysql');
const bcrypt = require('bcrypt');
bcrypt.genSalt(2, function(err, salt) {
  bcrypt.hash("myPlaintextPassword", salt, function(err, hash) {
      // Store hash in your password DB.
  });
});
// #endregion

// #region Importy plików
const { SERVER_PORT, CLIENT_PORT } = require('./config');

const spotifyRouter = require('./routes/spotify');
const discogsRouter = require('./routes/discogs');
const musixmatchRouter = require('./routes/musixmatch');
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

app.use(cors({
  origin: [`http://localhost:${CLIENT_PORT}`],
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(cookieParser());
app.use('/spotify', spotifyRouter);
app.use('/discogs', discogsRouter);
app.use('/musixmatch', musixmatchRouter);

app.listen(SERVER_PORT, () => {
  console.log(`Aplikacja nasłuchuje na porcie ${SERVER_PORT}`);
})
// #endregion