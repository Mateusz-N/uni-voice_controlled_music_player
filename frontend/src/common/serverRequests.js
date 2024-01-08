export const requestSpotifyAuthURL = async (callback) => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/spotify/auth-url`)
    .then((response) => {
        if(response.ok) {
            return response.json();
        }
    })
    .then((data) => {
        callback(data);
    })
    .catch(console.error);
}

export const requestGetUserProfile = async (callback) => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/spotify/user`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })
        .then((response) => {
            if(response.ok) {
                return response.json();
            }
            if(response.status === 401) {
                throw new Error('Invalid access token!');
            }
        })
        .then((data) => {
            callback(data);
        })
        .catch(console.error);
}

export const requestLogout = async (callback) => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/spotify/logout`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })
        .then((response) => {
            if(response.ok) {
                return response.json()
            }
            if(response.status === 401) {
                throw new Error('Invalid access token!');
            }
        })
        .then((data) => {
            callback(data);
        })
        .catch(console.error);
}

export const requestGetPlaylists = async (callback) => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/spotify/playlists`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })
        .then((response) => {
            if(response.ok) {
                return response.json();
            }
        })
        .then((data) => {
            callback(data);
        })
        .catch(console.error);
}

export const requestGetPlaylist = async (playlistID, callback) => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/spotify/playlist/${playlistID}`, {
        method: 'GET',
        credentials: 'include'
    })
        .then((response) => {
            if(response.ok) {
                return response.json();
            }
        })
        .then(async (data) => {
            callback(data);
        })
        .catch(console.error);
}

export const requestUpdatePlaylist = async (playlistID, changedDetail, callback) => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/spotify/playlist/${playlistID}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            detailName: changedDetail.name,
            detailValue: changedDetail.value
        }),
        credentials: 'include'
    })
        .then((response) => {
            if(response.ok) {
                return response.json();
            }
            if(response.status === 401) {
                throw new Error('Invalid access token!');
            }
            if(response.status === 422) {
                throw new Error('Request could not be processed. Make sure you are not sending null or undefined data!');
            }
        })
        .then((data) => {
            callback(data);
        })
        .catch(console.error);
}

export const requestAddTrackToPlaylist = async (playlistID, trackURIs, callback) => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/spotify/playlist/${playlistID}/tracks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            uris: trackURIs
        }),
        credentials: 'include'
    })
        .then((response) => {
            if(response.ok) {
                return response.json();
            }
        })
        .then((data) => {
            callback(data);
        })
        .catch(console.error);
}

export const requestRemoveTrackFromPlaylist = async (playlistID, trackURIs, callback) => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/spotify/playlist/${playlistID}/tracks`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            uris: trackURIs
        }),
        credentials: 'include'
    })
        .then((response) => {
            if(response.ok) {
                return response.json();
            }
        })
        .then((data) => {
            callback(data);
        })
        .catch(console.error);
    }

export const requestCreatePlaylist = async (userID, callback) => {
    return fetch(`${process.env.REACT_APP_SERVER_URL}/spotify/${userID}/playlist`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })
        .then((response) => {
            if(response.ok) {
                return response.json();
            }
            if(response.status === 401) {
                throw new Error('Invalid access token!');
            }
        })
        .then((data) => {
            return callback(data);
        })
        .catch(console.error);
}

export const requestDeletePlaylist = async (playlistID, callback) => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/spotify/playlist/${playlistID}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })
        .then((response) => {
            if(response.ok) {
                return response.json();
            }
            if(response.status === 401) {
                throw new Error('Invalid access token!');
            }
        })
        .then((data) => {
            callback(data);
        })
        .catch(console.error);
}

export const requestGeneratePlaylist = async (newPlaylistID, tracks, callback) => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/spotify/playlist/${newPlaylistID}/tracks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            uris: tracks.map(track => `spotify:track:${track.id}`)
        }),
        credentials: 'include'
    })
        .then((response) => {
            if(response.ok) {
                return response.json();
            }
        })
        .then((data) => {
            callback(data);
        })
        .catch(console.error);
}

export const requestGetArtist = async (artistID, callback) => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/spotify/artist/${artistID}`, {
        method: 'GET',
        credentials: 'include'
    })
        .then((response) => {
            if(response.ok) {
                return response.json()
            }
        })
        .then((data) => {
            callback(data);
        })
        .catch(console.error);
}

export const requestGetArtistAlbums = async (artistID, callback) => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/spotify/artist/${artistID}/albums`, {
        method: 'GET',
        credentials: 'include'
    })
        .then((response) => {
            if(response.ok) {
                return response.json()
            }
        })
        .then((data) => {
            callback(data);
        })
        .catch(console.error);
}

export const requestGetAlbum = async (albumID, callback) => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/spotify/album/${albumID}`, {
        method: 'GET',
        credentials: 'include'
    })
        .then((response) => {
            if(response.ok) {
                return response.json()
            }
        })
        .then((data) => {
            callback(data);
        })
        .catch(console.error);
}

export const requestGetTracksSavedStatus = async (trackIDs, callback) => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/spotify/tracks/saved/check?ids=${trackIDs}`, {
        method: 'GET',
        credentials: 'include'
    })
        .then((response) => {
            if(response.ok) {
                return response.json();
            }
        })
        .then((data) => {
            callback(data);
        })
        .catch(console.error);
}

export const requestToggleTrackSaved = async (trackID, saved, callback) => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/spotify/tracks/saved?ids=${trackID}`, {
        method: saved ? 'DELETE' : 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })
        .then((response) => {
            if(response.ok) {
                return response.json();
            }
            if(response.status === 401) {
                throw new Error('Invalid access token!');
            }
        })
        .then((data) => {
            callback(data);
        })
        .catch(console.error);
    }

export const requestSearch = async (query, itemTypes, callback) => {
    const itemTypesParam = itemTypes ? `&type=${itemTypes}` : '';
    fetch(`${process.env.REACT_APP_SERVER_URL}/spotify/search?query=${query}${itemTypesParam}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })
        .then((response) => {
            if(response.ok) {
                return response.json();
            }
        })
        .then((data) => {
            callback(data);
        })
        .catch(console.error);
}

export const requestGetRecommendations = async (recommendationsURL, callback) => {
    fetch(recommendationsURL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })
        .then((response) => {
            if(response.ok) {
                return response.json();
            }
        })
        .then((data) => {
            callback(data);
        })
        .catch(console.error);
}

export const requestGetAvailableGenres = async (callback) => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/spotify/genres`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })
        .then((response) => {
            if(response.ok) {
                return response.json();
            }
        })
        .then((data) => {
            callback(data);
        })
        .catch(console.error);
}