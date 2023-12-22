import { useRef, useEffect } from 'react';

import icon_search from 'resources/icon_search.svg';

import Styles from 'components/SearchBar.module.scss';

const SearchBar = () => {

    const searchForm = useRef(null);
    const searchInput = useRef(null);
    const searchIcon = useRef(null);

    // #region Wywołania zwrotne (useEffect Hooks)
    useEffect(() => {
        searchIcon.current.addEventListener('click', () => {
            searchForm.current.submit();
        })
    }, []);
    // #endregion

    // #region Struktura komponentu (JSX)
    return(
        <form id = {Styles.searchBar} action = {`${process.env.REACT_APP_SERVER_URL}/spotify/search`} method = 'GET' ref = {searchForm} >
            <input id = {Styles.searchInput} name = 'query' placeholder = 'Search for track, artist, album or playlist...' ref = {searchInput} />
            <img id = {Styles.searchIcon} src = {icon_search} alt = 'Search' ref = {searchIcon} />
        </form>
    );
    // #endregion
}

export default SearchBar;