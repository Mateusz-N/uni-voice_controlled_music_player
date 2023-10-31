const express = require('express');
const app = express();
const port = 3000;

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

app.use('/spotify', spotifyRouter)

app.listen(port, () => {
  console.log(`Aplikacja nasłuchuje na porcie ${port}`);
})