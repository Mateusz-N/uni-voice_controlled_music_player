const axios = require('axios');

module.exports = {
  getUserProfile: async (accessToken, callback) => {
    axios.get(
      'https://api.spotify.com/v1/me',
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
        .then((res_profile) => {
            callback(res_profile);
            console.log('API: User profile retrieved!');
        })
        .catch(console.error);
  },
  getPlaylists: async (accessToken, callback) => {
    const initialEndpoint = 'https://api.spotify.com/v1/me/playlists?limit=50';
    callback(await handleGetMultipleItemsRequest(accessToken, initialEndpoint, 'items'));
    console.log('API: Playlists retrieved!');
  },
  getPlaylist: async (accessToken, playlistID, callback) => {
    let initialEndpoint = `https://api.spotify.com/v1/playlists/${playlistID}`;
    let nextEndpointReference = 'tracks.next';
    let itemsReference = 'tracks.items';
    if(playlistID === '2') { // Polubione utwory
      initialEndpoint = 'https://api.spotify.com/v1/me/tracks?limit=50';
      nextEndpointReference = 'next';
      itemsReference = 'items';
    }
    callback(await handleGetSingleItemRequest(accessToken, initialEndpoint, nextEndpointReference, itemsReference));
    console.log('API: Playlist retrieved!');
  },
  getArtistAlbums: async (accessToken, artistID, callback) => {
    let initialEndpoint = `https://api.spotify.com/v1/artists/${artistID}/albums`;
    callback(await handleGetMultipleItemsRequest(accessToken, initialEndpoint, 'items'));
    console.log('API: Artist albums retrieved!');
  },
  getAlbum: async (accessToken, albumID, callback) => {
    const initialEndpoint = `https://api.spotify.com/v1/albums/${albumID}`;
    const nextEndpointReference = 'tracks.next';
    const itemsReference = 'tracks.items';
    callback(await handleGetSingleItemRequest(accessToken, initialEndpoint, nextEndpointReference, itemsReference));
    console.log('API: Album retrieved!');
  },
  getArtist: async (accessToken, artistID, callback) => {
    axios.get(
      `https://api.spotify.com/v1/artists/${artistID}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    )
    .then((res_artist) => {
        callback(res_artist);
        console.log('API: Artist retrieved!');
    })
    .catch(console.error);
  },
  search: async (accessToken, query, types, callback) => {
    const results = {};
    for (const type of types) {
      const initialEndpoint = `https://api.spotify.com/v1/search?q=${query}&type=${type}&limit=50`;
      results[type] = await handleGetMultipleItemsRequest(accessToken, initialEndpoint, `${type}s.items`);
    }
    callback(results);
    console.log('API: Search executed!');
  },
  createPlaylist: async (accessToken, userID, playlistProperties, callback) => {
    axios({
      method: 'POST',
      url: `https://api.spotify.com/v1/users/${userID}/playlists`,
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      data: playlistProperties
    })
    .then((res_playlist) => {
        callback(res_playlist);
        console.log('API: Playlist created!');
    })
    .catch(console.error);
  },
  deletePlaylist: async (accessToken, playlistID, callback) => {
    axios.delete(
      `https://api.spotify.com/v1/playlists/${playlistID}/followers`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    )
    .then((res_playlist) => {
        callback(res_playlist);
        console.log('API: Playlist deleted!');
    })
    .catch(console.error);
  },
  updatePlaylist: async (accessToken, playlistID, updatedDetailName, updatedDetailValue, callback) => {
    axios({
      method: 'PUT',
      url: `https://api.spotify.com/v1/playlists/${playlistID}`,
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      data: {
        [updatedDetailName]: updatedDetailValue
      }
    })
    .then((res_playlist) => {
        callback(res_playlist);
        console.log('API: Playlist updated!');
    })
    .catch(console.error);
  },
  checkTracksSaved: async (accessToken, IDs, callback) => {
    axios.get(
      `https://api.spotify.com/v1/me/tracks/contains?ids=${IDs}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    )
    .then((res_check) => {
        callback(res_check);
        console.log('API: Tracks\' saved status checked!');
    })
    .catch(console.error);
  },
  toggleTrackSaved: async (accessToken, method, IDs, callback) => {
    axios({
      method: method,
      url: `https://api.spotify.com/v1/me/tracks?ids=${IDs}`,
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
    .then((res_toggleTrackSaved) => {
        callback(res_toggleTrackSaved);
        console.log('API: Tracks\' saved status toggled!');
    })
    .catch(console.error);
  },
  trackInPlaylist: async (accessToken, playlistID, trackURIs, method, callback) => {
    axios({
      method: method,
      url: `https://api.spotify.com/v1/playlists/${playlistID}/tracks`,
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      data: {
        uris: trackURIs
      }
    })
    .then((res_toggleTrackInPlaylist) => {
      callback(res_toggleTrackInPlaylist);
      console.log('API: Tracks\' presence in playlist toggled!');
    })
    .catch(console.error);
  },
  getGenres: async (accessToken, callback) => {
    axios.get(
      'https://api.spotify.com/v1/recommendations/available-genre-seeds',
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    )
    .then((res_genres) => {
        callback(res_genres);
        console.log('API: Genres retrieved!');
    })
    .catch(console.error);
  },
  getRecommendations: async (accessToken, recommendationParams, callback) => {
    axios.get(
      'https://api.spotify.com/v1/recommendations',
      {
        params: recommendationParams,
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    )
    .then((res_genres) => {
        callback(res_genres);
        console.log('API: Recommendations retrieved!');
    })
    .catch(console.error);
  }
}

const handleGetItemsRequest = async (accessToken, initialEndpoint, onSuccess) => {
/*Obsługa wszelkiego rodzaju żądań,
  które pobierają dane z wykorzystaniem paginacji*/
  let nextEndpoint = initialEndpoint;
  let items = null;
  do {
    const res_items = await axios.get(
      nextEndpoint,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
      }
    );
    if(res_items.status === 200) {
      [items, nextEndpoint] = onSuccess(items, res_items, nextEndpoint);
    }
    else {
      res.status(res_items.status).send({
        error: 'Something went wrong!'
      });
    }
  }
  while(nextEndpoint);
  return items;
}
  
const getPropertyByString = (object, string) => {
  const properties = string.split('.');
  while(properties.length > 0) {
    object = object[properties.shift()];
  }
  return object;
}
  
const handleGetSingleItemRequest = async (accessToken, initialEndpoint, nextEndpointReference, responseBodyItemsReference) => {
  const onSuccess = (item, res_item, nextEndpoint) => {
    const itemPage = res_item.data;
    if(!item) {
      item = itemPage;
      nextEndpoint = getPropertyByString(itemPage, nextEndpointReference);
    }
    else {
      getPropertyByString(item, responseBodyItemsReference).push(...itemPage.items);
      nextEndpoint = itemPage.next;
    }
    return [item, nextEndpoint]
  }
  return await handleGetItemsRequest(accessToken, initialEndpoint, onSuccess);
}
  
const handleGetMultipleItemsRequest = async (accessToken, initialEndpoint, responseBodyItemsReference) => {
  const onSuccess = (items, res_items, nextEndpoint) => {
    const itemsPage = getPropertyByString(res_items.data, responseBodyItemsReference).map(item => {
      return {
        id: item.id,
        type: item.type,
        name: item.name,
        thumbnailSrc: item.images ? (item.images[0] ? item.images[0].url : null) : null
      }
    });
    if(!items) {
      items = itemsPage;
    }
    else {
      items.push(...itemsPage);
    }
    nextEndpoint = res_items.data.next;
    return [items, nextEndpoint]
  }
  return await handleGetItemsRequest(accessToken, initialEndpoint, onSuccess);
}