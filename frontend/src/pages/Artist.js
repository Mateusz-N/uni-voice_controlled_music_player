import { Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import Cookies from 'js-cookie';

import btn_sync from 'resources/btn_sync.svg';
import placeholderAlbumCoverSrc from 'resources/albumCover_placeholder.png';

import NavBar from 'components/NavBar';
import PlaybackPanel from 'components/PlaybackPanel';
import CatalogBrowser from 'components/CatalogBrowser';
import OverviewPanel from 'components/OverviewPanel';

import Styles from 'pages/Home.module.scss';

const Artist = () => {
    const artistID = window.location.href.split('/').pop();
    const [artist, setArtist] = useState({
        id: artistID,
        name: 'Unknown artist',
        thumbnailSrc: placeholderAlbumCoverSrc,
        genres: [],
        followers: 'N/A',
        popularity: 'N/A',
        detailsToDisplay: []
    });
    const [albums, setAlbums] = useState([]);
    const btnSync = useRef(null);

    const getArtist = () => {
        btnSync.current.classList.add(Styles.spinning);
        if(Cookies.get('userID')) {
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
                    const artist = {
                        id: artistID,
                        name: data.name,
                        thumbnailSrc: (data.images.length > 0 ? data.images[0].url : placeholderAlbumCoverSrc),
                        genres: data.genres,
                        followers: data.followers.total,
                        popularity: data.popularity,
                        detailsToDisplay: [{
                            name: 'Genres',
                            content: data.genres ? data.genres.join(', ') : 'N/A'
                        }, {
                            name: 'Followers',
                            content: data.followers.total || 'N/A'
                        }, {
                            name: 'Popularity',
                            content: data.popularity || 'N/A'
                        }]
                    }
                    setArtist(artist);
                })
                .catch(console.error);
            getAlbums(artistID);
        }
    }
    const getAlbums = (artistID) => {
        if(Cookies.get('userID')) {
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
                    setAlbums(data);
                    btnSync.current.classList.remove(Styles.spinning);
                })
                .catch(console.error);
        }
    }
    const handleSyncWithSpotify = () => {
        getArtist();
    }

    useEffect(() => {
        getArtist();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    // #region Struktura komponentu (JSX)
    return (
        <div id = 'page'>
            <NavBar />
            <CatalogBrowser className = 'collectionBrowser hasOverviewPanel'>
                <h1 id = {Styles.catalogHeader}>
                    {artist.name}&nbsp;
                    <img src = {btn_sync} alt = 'Sync with Spotify' id = {Styles.btnSync} onClick = {handleSyncWithSpotify} ref = {btnSync} />
                </h1>
                <main id = {Styles.mainSection}>
                    {
                        albums.map((album, index) => {
                            return(
                                <article key = {index} className = {Styles.catalogItem}>
                                    <Link to = {'/album/' + album.id}>
                                        <img src = {album.thumbnailSrc} alt = {album.name} className = {Styles.catalogItem_thumbnail} />
                                    </Link>
                                    <Link to = {'/album/' + album.id}><h4 className = {Styles.catalogItem_name}>{album.name}</h4></Link>
                                </article>
                            );
                        })
                    }
                </main>
                <OverviewPanel data = {artist} for = 'artist' />
            </CatalogBrowser>
            <PlaybackPanel track = {{
                duration_ms: '15000',
                trackTitle: 'Song',
                artists: ['Artist'],
                albumTitle: 'Artist',
                albumCoverSrc: placeholderAlbumCoverSrc
            }} />
        </div>
    );
    // #endregion
}

export default Artist;