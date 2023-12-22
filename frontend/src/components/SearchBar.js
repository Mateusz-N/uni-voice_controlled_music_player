import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import icon_search from 'resources/icon_search.svg';

import Styles from 'components/SearchBar.module.scss';

const SearchBar = () => {

    const searchForm = useRef(null);
    const searchInput = useRef(null);
    const searchIcon = useRef(null);
    const navigate = useNavigate();

    // #region Wywołania zwrotne (useEffect Hooks)
    useEffect(() => {
        searchForm.current.addEventListener('submit', (event) => {
            event.preventDefault();
            navigate(`/search?query=${searchInput.current.value}`);
        })
        searchIcon.current.addEventListener('click', () => {
            searchForm.current.submit();
        })
    }, [navigate]);
    // #endregion

    // #region Struktura komponentu (JSX)
    return(
        <form id = {Styles.searchBar} action = '/search' method = 'GET' ref = {searchForm} >
            <input id = {Styles.searchInput} name = 'query' placeholder = 'Search for track, artist, album or playlist...' ref = {searchInput} />
            <img id = {Styles.searchIcon} src = {icon_search} alt = 'Search' ref = {searchIcon} />
        </form>
    );
    // #endregion
}

export default SearchBar;