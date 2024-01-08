import { useRef, useEffect } from 'react';

import icon_search from 'resources/icon_search.svg';

import Styles from 'components/generic/SearchBar.module.scss';

const SearchBar = (props) => {
    // #region Zmienne referencji (useRef Hooks)
    const searchForm = useRef(null);
    const searchInput = useRef(null);
    const searchIcon = useRef(null);
    // #endregion

    // #region Obsługa zdarzeń (Event Handlers)
    const handleSearchFormSubmit = (event) => {
        event.preventDefault();
        props.onSubmit(searchInput.current.value);
    }
    const handleSearchIconClick = (event) => {
        handleSearchFormSubmit(event);
    }
    // #endregion

    // #region Wywołania zwrotne (useEffect Hooks)
    useEffect(() => {
        if(searchForm.current) {
            searchForm.current.addEventListener('submit', handleSearchFormSubmit);
        }
        if(searchIcon.current) {
            searchIcon.current.addEventListener('click', handleSearchIconClick);
        }
        return () => {
            if(searchForm.current) {
                searchForm.current.removeEventListener('submit', handleSearchFormSubmit);
            }
            if(searchIcon.current) {
                searchIcon.current.removeEventListener('click', handleSearchIconClick);
            }
        }
    }, []);
    // #endregion

    // #region Struktura komponentu (JSX)
    return(
        <form id = {Styles.searchBar} action = '/search' method = 'GET' ref = {searchForm} >
            <input id = {Styles.searchInput} name = 'query' placeholder = 'Search' ref = {searchInput} />
            <img id = {Styles.searchIcon} src = {icon_search} alt = 'Search' ref = {searchIcon} />
        </form>
    );
    // #endregion
}

export default SearchBar;