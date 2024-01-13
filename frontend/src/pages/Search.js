import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

import { requestSearch } from 'common/serverRequests';

import placeholderAlbumCoverSrc from 'resources/albumCover_placeholder.png';

import NavBar from 'components/NavBar/NavBar';
import PlaybackPanel from 'components/PlaybackPanel';
import CatalogBrowser from 'components/CatalogBrowser';

import Styles from 'pages/Home.module.scss';

const Search = () => {
    // #region Zmienne lokacji (useLocation Hooks)
    const windowLocation = useLocation();
    // #endregion

    // #region Zmienne stanu (useState Hooks)
    const [loggedIn, setLoggedIn] = useState(!!Cookies.get('userID'));
    const [results, setResults] = useState([]);
    // #endregion

    // #region Obsługa zdarzeń (Event Handlers)
    const handleLogin = () => {
        setLoggedIn(true);
    }
    const handleLogout = () => {
        setLoggedIn(false);
    }
    // #endregion

    // #region Wywołania zwrotne (useEffect Hooks)
    useEffect(() => {
        if(!loggedIn) {
            setResults([]);
            return;
        }
        const query = new URLSearchParams(windowLocation.search).get('query');
        requestSearch(query, null, (data) => {
            Object.keys(data).forEach(type => {
                setResults(prevState => [...prevState, ...data[type]]);
            });
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loggedIn]);
    // #endregion

    // #region Struktura komponentu (JSX)
    return (
        <div id = 'page'>
            <NavBar onLogin = {handleLogin} onLogout = {handleLogout} />
            <CatalogBrowser>
                <h1 id = {Styles.catalogHeader}>
                    Results&nbsp;
                </h1>
                <main id = {Styles.mainSection}>
                    {
                        results.map((result, index) => {
                            if(['artist', 'playlist', 'album'].includes(result.type)) { // Inne typy obecnie nie są wspierane
                                return(
                                    <article key = {index} className = {Styles.catalogItem}>
                                        <main className = {Styles.catalogItem_thumbnail}>
                                            <Link to = {'/' + result.type + '/' + result.id}>
                                                <img
                                                    src = {result.thumbnailSrc || placeholderAlbumCoverSrc}
                                                    alt = {result.name}
                                                    className = {`${Styles.catalogItem_thumbnailImage} ${result.type === 'artist' ? Styles.catalogItem_thumbnail_artist : ''}`}
                                                />
                                            </Link>
                                        </main>
                                        <Link to = {'/' + result.type + '/' + result.id}>
                                            <h4 className = {Styles.catalogItem_name}>{result.name}</h4>
                                        </Link>
                                    </article>
                                );
                            }
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
    // #endregion
}

export default Search;