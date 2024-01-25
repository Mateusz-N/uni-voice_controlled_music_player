const dbConnection = require('../db/db');

module.exports = {
    registerUserConnection: (accessToken, refreshToken) => {
        const query = `INSERT INTO connection(access_token, refresh_token) VALUES('${accessToken}', '${refreshToken}')`;
        dbConnection.query(query, (err) => {
            if(err) throw err;
            console.log('DB: Connection registered!');
        });
    },
    unregisterUserConnection: (accessToken) => {
        const query = `DELETE FROM connection WHERE access_token = '${accessToken}'`;
        dbConnection.query(query, (err) => {
            if(err) throw err;
            console.log('DB: Connection unregistered!');
        });
    },
    addUserProfile: (accessToken, userID, userName, profilePicURL, callback) => {
        const query = `INSERT IGNORE INTO user(id, username, profile_picture) VALUES('${userID}', '${userName}', '${profilePicURL}')`;
        dbConnection.query(query, (err) => {
            if(err) throw err;
            console.log('DB: User profile added!');

            const query = `UPDATE connection SET user_id = '${userID}' WHERE access_token = '${accessToken}'`;
            dbConnection.query(query, (err) => {
                if(err) throw err;
                console.log('DB: Access token attached to user!');
                const query = `INSERT IGNORE INTO user_preferences(user_id, auto_spotify_sync, default_voice_input_enabled) VALUES('${userID}', false, false)`;
                dbConnection.query(query, (err) => {
                    if(err) throw err;
                    console.log('DB: User preferences set!');
                    callback();
                })
            })
        });
    },
    getUserProfile: (accessToken, callback) => {
        const query = `SELECT user.* FROM user, connection WHERE connection.access_token = '${accessToken}' AND connection.user_id = user.id`;
        dbConnection.query(query, (err, rows) => {
            if(err) throw err;
            callback(rows);
        });
    },
    getUserPreferences: (userID, callback) => {
        const query = `SELECT * FROM user_preferences WHERE user_id = '${userID}'`;
        dbConnection.query(query, (err, rows) => {
            if(err) throw err;
            callback(rows);
        });
    },
    updateUserPreference: (userID, preferenceName, newValue) => {
        const query = `UPDATE user_preferences SET ${preferenceName} = ${newValue} WHERE user_id = '${userID}'`;
        dbConnection.query(query, (err) => {
            if(err) throw err;
            console.log('DB: Preference updated!');
        });
    },
    getUserPlaylists: (userID, callback) => {
        const query = `SELECT playlist.* FROM playlist, user_playlists, user WHERE playlist.id = user_playlists.playlist_id AND user_playlists.user_id = user.id AND user.id = '${userID}'`;
        dbConnection.query(query, (err, rows) => {
            if(err) throw err;
            callback(rows);
        });
    },
    addUserPlaylists: (userID, playlists) => {
        const playlistsAsTuples = playlists.map(playlist => [playlist.id, playlist.name, playlist.description, playlist.thumbnailSrc, playlist.public, playlist.collaborative]);
        const query = `INSERT IGNORE INTO playlist(id, name, description, thumbnail, public, collaborative) VALUES ?`;
        truncateTable('user_playlists', () => {
            truncateTable('playlist', () => {
                dbConnection.query(query, [playlistsAsTuples], (err) => {
                    if(err) throw err;
                    console.log('DB: User playlists added!');
        
                    const idPairs = playlists.map(playlist => [userID, playlist.id]);
                    const query = `INSERT IGNORE INTO user_playlists(user_id, playlist_id) VALUES ?`;
                    dbConnection.query(query, [idPairs], (err) => {
                        if(err) throw err;
                        console.log('DB: User playlists attached to user!');
                    });
                });
            });
        });
    },
    getPlaylist: (playlistID, callback) => {
        const query = `SELECT * FROM playlist WHERE id = '${playlistID}'`;
        dbConnection.query(query, (err, rows) => {
            if(err) throw err;
            callback(rows);
        });
    }
}

const truncateTable = (tableName, callback) => {
    const query = `DELETE FROM ${tableName}`; // TRUNCATE narusza więzy integralności; DELETE jest wolniejsze, lecz bezpieczniejsze
    dbConnection.query(query, (err) => {
        if(err) throw err;
        callback();
        console.log(`DB: Table ${tableName} truncated!`);
    });
}