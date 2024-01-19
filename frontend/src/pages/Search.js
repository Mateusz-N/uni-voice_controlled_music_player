import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import Cookies from 'js-cookie';

import { requestSearch } from 'common/serverRequests';

import placeholderAlbumCoverSrc from 'resources/albumCover_placeholder.png';
import btn_sync from 'resources/btn_sync.svg';

import NavBar from 'components/NavBar/NavBar';
import CatalogBrowser from 'components/CatalogBrowser';

import Styles from 'pages/Home.module.scss';

const Search = () => {
    // #region Zmienne lokacji (useLocation Hooks)
    const windowLocation = useLocation();
    // #endregion

    // #region Zmienne stanu (useState Hooks)
    const [results, setResults] = useState([]);
    // #endregion

    // #region Zmienne referencji (useRef Hooks)
    const btnSync = useRef(null);
    // #endregion
    
    // #region Obsługa zdarzeń (Event Handlers)
    const handleLogin = () => {
        getResults();
    }
    const handleLogout = () => {
        getResults();
    }
    const handleSyncWithSpotify = () => {
        getResults();
    }
    const handleSearchApiResponse = (data) => {
        Object.keys(data).forEach(type => {
            setResults(prevState => [...prevState, ...data[type]]);
        });
        btnSync.current.classList.remove(Styles.spinning);
    }
    // #endregion

    // #region Wywołania zwrotne (useEffect Hooks)
    useEffect(() => {
        getResults();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    // #endregion

    // #region Funkcje pomocnicze
    const getResults = () => {
        const loggedIn = !!Cookies.get('userID');
        if(!loggedIn) {
            setResults([]);
            return;
        }
        const query = new URLSearchParams(windowLocation.search).get('query');
        btnSync.current.classList.add(Styles.spinning);
        requestSearch(query, null, handleSearchApiResponse, () => {});
    }
    // #endregion

    // #region Struktura komponentu (JSX)
    return (
        <div id = 'page'>
            <NavBar onLogin = {handleLogin} onLogout = {handleLogout} onSyncWithSpotify = {handleSyncWithSpotify} />
            <CatalogBrowser>
                <h1 id = {Styles.catalogHeader}>
                    Results&nbsp;
                    <img src = {btn_sync} alt = 'Sync with Spotify' id = {Styles.btnSync} onClick = {handleSyncWithSpotify} ref = {btnSync} />
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
                            return null;
                        })
                    }
                </main>
            </CatalogBrowser>
        </div>
    );
    // #endregion
}

export default Search;