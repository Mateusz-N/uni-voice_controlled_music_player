const express = require('express')
const queryString = require('node:querystring');
const axios = require('axios');
const router = express.Router();

router.get('/', async (req, res) => {
    const artist = await axios.get('https://api.discogs.com/artists/135946');
    res.send(`<p>Profil artysty <strong>${artist.data.name}</strong>: <blockquote><em>${artist.data.profile}</em></blockquote></p>`);
  });

module.exports = router;