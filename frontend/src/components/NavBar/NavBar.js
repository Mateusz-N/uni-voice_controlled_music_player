import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

import { requestGetUserProfile, requestLogout, requestSpotifyAuthURL } from 'common/serverRequests';

import homeIcon from 'resources/home.svg';
import microphone_idle from 'resources/microphone_idle.svg';
import microphone_active from 'resources/microphone_active.svg';

import SearchBar from 'components/generic/SearchBar';
import ContextMenu from 'components/generic/ContextMenu';
import Toast from 'components/generic/Toast';

import Styles from 'components/NavBar/NavBar.module.scss';

const NavBar = (props) => {
    // #region Zmienne stanu (useState Hooks)
    const [loggedIn, setLoggedIn] = useState(false);
    const [microphoneActive, setMicrophoneActive] = useState(false);
    const [microphoneEnabled, setMicrophoneEnabled] = useState(false);
    const [profileContextMenuExpanded, setProfileContextMenuExpanded] = useState(false);
    const [spotifyAuthURL, setSpotifyAuthURL] = useState('');
    const [notification, setNotification] = useState({});
    // #endregion

    // #region Zmienne referencji (useRef Hooks)
    const ref_profilePic = useRef(null);
    // #endregion

    // #region Zmienne nawigacji (useNavigate Hooks)
    const navigate = useNavigate();
    // #endregion

    // #region Obsługa zdarzeń (Event Handlers)
    const handleToggleMicrophone = () => {
        setMicrophoneEnabled(prevState => !prevState);
    }
    const handleLogin = () => {
    /*  Otwarcie wyskakującego okienka z autoryzacją w serwisie Spotify */
        const popup = window.open(spotifyAuthURL, 'popup', 'popup=true');
        const checkPopup = setInterval(() => {
            if(popup.closed) {
                clearInterval(checkPopup);
                requestGetUserProfile((data) => {
                    Cookies.set('userID', data.userID, {secure: true, sameSite: 'strict'});
                    Cookies.set('userName', data.userName, {secure: true, sameSite: 'strict'});
                    Cookies.set('profilePicURL', data.profilePicURL, {secure: true, sameSite: 'strict'});
                    setLoggedIn(true);
                    props.onLogin();
                    setNotification(data.message);
                });
            }
        }, 100);
    }
    const handleLogout = () => {
    /*  Logika związana z sesją użytkownika opiera się
        na ciasteczkach po stronie klienta, więc wystarczy je usunąć */
        requestLogout((data) => {
            Cookies.remove('userID');
            Cookies.remove('userName');
            Cookies.remove('profilePicURL');
            props.onLogout();
            setNotification(data.message);
        });
        setLoggedIn(false);
    }
    const handleToggleProfileContextMenu = () => {
        setProfileContextMenuExpanded(prevState => !prevState);
    }
    const handleClickOutsideProfileContextMenu = (event) => {
        if(profileContextMenuExpanded && (ref_profilePic.current && event.target !== ref_profilePic.current || event.target.className.includes(Styles.profile_contextMenu_option))) {
            setProfileContextMenuExpanded(false);
        }
    }
    const handleSearchFormSubmit = (query) => {
        navigate(`/search?query=${query}`);
    }
    // #endregion

    // #region Wywołania zwrotne (useEffect Hooks)
    useEffect(() => {
        if(Cookies.get('userID')) {
            setLoggedIn(true);
        }
        if(spotifyAuthURL === '') {
            requestSpotifyAuthURL((data) => {
                setSpotifyAuthURL(data.authURL);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);
    useEffect(() => {
        document.body.addEventListener('click', handleClickOutsideProfileContextMenu);
        return () => {
            document.body.removeEventListener('click', handleClickOutsideProfileContextMenu);
        };
    },[profileContextMenuExpanded]);
    // #endregion

    // #region Przypisanie dynamicznych elementów komponentu
    let toastNotification = null;
    if(notification.message) {
        toastNotification =
            createPortal(<Toast message = {notification.message} type = {notification.type} onAnimationEnd = {() => setNotification({})} />, document.body);
    }
    // #endregion

    // #region Struktura komponentu (JSX)
    return(
        <>
            {toastNotification}
            <nav id = {Styles.navBar}>
                <section id = {Styles.navBar_leftSection} className = {Styles.navBar_section}>
                    <Link to = '/'>
                        <img src = {homeIcon} alt = 'Home' id = {Styles.homeIcon} />
                    </Link>
                    <SearchBar onSubmit = {(query) => handleSearchFormSubmit(query)} />
                </section>
                <div id = {Styles.microphoneContainer}>
                    <img
                        src = {microphoneActive ? microphone_active : microphone_idle}
                        alt = {microphoneEnabled ? (microphoneActive ? 'Capturing voice...' : 'Awaiting input...') : 'Microphone off'}
                        id = {Styles.microphoneIcon}
                        className = {microphoneEnabled ? Styles.microphoneIcon_enabled : Styles.microphoneIcon_disabled}
                        onClick = {handleToggleMicrophone}
                    />
                </div>
                <section id = {Styles.navBar_rightSection} className = {Styles.navBar_section}>
                    {loggedIn ?
                        <img
                            src = {Cookies.get('profilePicURL')}
                            alt = {Cookies.get('userName')}
                            id = {Styles.profilePic}
                            onClick = {handleToggleProfileContextMenu}
                            ref = {ref_profilePic}
                        />
                        :
                        <button id = {Styles.btnLogin} className = 'btnPrimary' onClick = {handleLogin}>Connect with Spotify</button>
                    }
                    <ContextMenu expanded = {profileContextMenuExpanded} context = 'profile' styles = {Styles}>
                        <li id = {Styles.profileContextMenu_settings}><Link to = '/settings'>Settings</Link></li>
                        <li id = {Styles.profileContextMenu_disconnect} onClick = {handleLogout} dangerous = 'true'>Disconnect</li>
                    </ContextMenu>
                </section>
            </nav>
        </>
    );
    // #endregion
}

export default NavBar;