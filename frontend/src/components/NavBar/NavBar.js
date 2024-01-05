import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

import homeIcon from 'resources/home.svg';
import microphone_idle from 'resources/microphone_idle.svg';
import microphone_active from 'resources/microphone_active.svg';

import SearchBar from 'components/NavBar/SearchBar';
import ContextMenu from 'components/generic/ContextMenu';

import Styles from 'components/NavBar/NavBar.module.scss';

const NavBar = (props) => {
    // #region Zmienne stanu (useState Hooks)
    const [loggedIn, setLoggedIn] = useState(false);
    const [microphoneActive, setMicrophoneActive] = useState(false);
    const [microphoneEnabled, setMicrophoneEnabled] = useState(false);
    const [profileContextMenuExpanded, setProfileContextMenuExpanded] = useState(false);
    const [spotifyAuthURL, setSpotifyAuthURL] = useState('');
    // #endregion

    const ref_profilePic = useRef(null);

    // #region Zmienne konfiguracyjne
    const SERVER_URL = process.env.REACT_APP_SERVER_URL;
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
                fetch(`${SERVER_URL}/spotify/user`, {
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
                        if(response.status === 401) {
                            throw new Error('Invalid access token!');
                        }
                    })
                    .then((data) => {
                        Cookies.set('userID', data.userID, {secure: true, sameSite: 'strict'});
                        Cookies.set('userName', data.userName, {secure: true, sameSite: 'strict'});
                        Cookies.set('profilePicURL', data.profilePicURL, {secure: true, sameSite: 'strict'});
                        setLoggedIn(true);
                        props.onLogin();
                        console.info(data.message);
                    })
                    .catch(console.error);
            }
        }, 100);
    }
    const handleLogout = () => {
    /*  Logika związana z sesją użytkownika opiera się
        na ciasteczkach po stronie klienta, więc wystarczy je usunąć */
        fetch(`${SERVER_URL}/spotify/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            })
                .then((response) => {
                    if(response.ok) {
                        return response.json()
                    }
                    if(response.status === 401) {
                        throw new Error('Invalid access token!');
                    }
                })
                .then((data) => {
                    Cookies.remove('userID');
                    Cookies.remove('userName');
                    Cookies.remove('profilePicURL');
                    props.onLogout();
                    console.info(data.message);
                })
                .catch(console.error);
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
    // #endregion

    // #region Wywołania zwrotne (useEffect Hooks)
    useEffect(() => {
        if(Cookies.get('userID')) {
            setLoggedIn(true);
        }
        if(spotifyAuthURL === '') {
            fetch(`${SERVER_URL}/spotify/auth-url`)
                .then((response) => {
                    if(response.ok) {
                        return response.json()
                    }
                })
                .then((data) => setSpotifyAuthURL(data.authURL))
                .catch(console.error);
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

    // #region Struktura komponentu (JSX)
    return(
        <nav id = {Styles.navBar}>
            <section id = {Styles.navBar_leftSection} className = {Styles.navBar_section}>
                <Link to = '/'>
                    <img src = {homeIcon} alt = 'Home' id = {Styles.homeIcon} />
                </Link>
                <SearchBar />
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
    );
    // #endregion
}

export default NavBar;