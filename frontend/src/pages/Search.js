import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

import placeholderAlbumCoverSrc from 'resources/albumCover_placeholder.png';

import NavBar from 'components/NavBar';
import PlaybackPanel from 'components/PlaybackPanel';
import CatalogBrowser from 'components/CatalogBrowser';

import Styles from 'pages/Home.module.scss';

const Search = () => {
    const windowLocation = useLocation();
    const [results, setResults] = useState([]);
    useEffect(() => {
        if(Cookies.get('userID')) {
            const query = new URLSearchParams(windowLocation.search).get('query');
            fetch(`${process.env.REACT_APP_SERVER_URL}/spotify/search?query=${query}`, {
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
                    Object.keys(data).forEach(type => {
                        setResults(prevState => [...prevState, ...data[type]]);
                    });
                })
                .catch(console.error);
        }
    }, []);
    return (
        <div id = 'page'>
            <NavBar />
            <CatalogBrowser>
                <h1 id = {Styles.catalogHeader}>
                    Results&nbsp;
                </h1>
                <main id = {Styles.mainSection}>
                    {
                        results.map((result, index) => {
                            return(
                                <article key = {index} className = {Styles.catalogItem}>
                                    <Link to = {result.id}>
                                        <img src = {result.thumbnailSrc || placeholderAlbumCoverSrc} alt = {result.name} className = {`${Styles.catalogItem_thumbnail} ${result.type === 'artist' ? Styles.catalogItem_thumbnail_artist : ''}`} />
                                    </Link>
                                    <Link to = {'/playlist/' + result.id}><h4 className = {Styles.catalogItem_name}>{result.name}</h4></Link>
                                </article>
                            );
                        })
                    }
                </main>
            </CatalogBrowser>
            <PlaybackPanel track = {{
                duration_ms: '15000',
                trackTitle: 'Song',
                artists: ['Artist'],
                albumTitle: 'Album',
                albumCoverSrc: placeholderAlbumCoverSrc
            }} />
        </div>
    );
}

export default Search;