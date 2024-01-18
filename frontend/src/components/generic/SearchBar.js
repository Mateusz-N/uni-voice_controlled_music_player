import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Cookies from 'js-cookie';

import icon_search from 'resources/icon_search.svg';

import Toast from 'components/generic/Toast';

import Styles from 'components/generic/SearchBar.module.scss';

const SearchBar = (props) => {
    // #region Zmienne stanu (useState Hooks)
    const [notification, setNotification] = useState({});
    // #endregion

    // #region Zmienne referencji (useRef Hooks)
    const searchForm = useRef(null);
    const searchInput = useRef(null);
    const searchIcon = useRef(null);
    // #endregion

    // #region Obsługa zdarzeń (Event Handlers)
    const handleSearchFormSubmit = (event) => {
        event.preventDefault();
        const loggedIn = !!Cookies.get('userID');
        if(!loggedIn) {
            setNotification({message: 'You must log in to perform this operation!', type: 'error'});
            return;
        }
        props.onSubmit(searchInput.current.value);
    }
    const handleSearchIconClick = (event) => {
        handleSearchFormSubmit(event);
    }
    // #endregion

    // #region Wywołania zwrotne (useEffect Hooks)
    useEffect(() => {
        let searchFormCurrent;
        let searchIconCurrent;
        if(searchForm.current) {
            searchForm.current.addEventListener('submit', handleSearchFormSubmit);
            searchFormCurrent = searchForm.current;
        }
        if(searchIcon.current) {
            searchIcon.current.addEventListener('click', handleSearchIconClick);
            searchIconCurrent = searchIcon.current;
        }
        return () => {
            if(searchFormCurrent) {
                searchFormCurrent.removeEventListener('submit', handleSearchFormSubmit);
            }
            if(searchIconCurrent) {
                searchIconCurrent.removeEventListener('click', handleSearchIconClick);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    // #endregion

    // #region Przypisanie dynamicznych elementów komponentu
    let toastNotification = null;
    if(notification.message) {
        toastNotification =
            createPortal(<Toast
                message = {notification.message}
                type = {notification.type} 
                onAnimationEnd = {() => setNotification({})}
            />, document.body);
    }
    // #endregion

    // #region Struktura komponentu (JSX)
    return(
        <>
            {toastNotification}
            <form id = {Styles.searchBar} action = '/search' method = 'GET' ref = {searchForm} >
                <input id = {Styles.searchInput} name = 'query' placeholder = 'Search' ref = {searchInput} />
                <img id = {Styles.searchIcon} src = {icon_search} alt = 'Search' ref = {searchIcon} />
            </form>
        </>
    );
    // #endregion
}

export default SearchBar;