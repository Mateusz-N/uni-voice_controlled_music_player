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
    if(playlistID === '1') { // Polubione utwory
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
    .then((res_profile) => {
        callback(res_profile);
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