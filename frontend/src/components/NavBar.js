import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

import homeIcon from 'resources/home.svg';
import microphone_idle from 'resources/microphone_idle.svg';
import microphone_active from 'resources/microphone_active.svg';

import SearchBar from 'components/SearchBar';

import Styles from 'components/NavBar.module.scss';

const NavBar = (props) => {
    // #region Zmienne stanu (useState Hooks)
    const [loggedIn, setLoggedIn] = useState(false);
    const [microphoneActive, setMicrophoneActive] = useState(false);
    const [microphoneEnabled, setMicrophoneEnabled] = useState(false);
    const [profileContextMenuExpanded, setProfileContextMenuExpanded] = useState(false);
    const [spotifyAuthURL, setSpotifyAuthURL] = useState('');
    // #endregion

    // #region Zmienne konfiguracyjne
    const SERVER_PORT_HTTPS = process.env.SERVER_PORT_HTTPS || 3060;
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
                fetch(`https://localhost:${SERVER_PORT_HTTPS}/spotify/user`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                })
                    .then((response) => {
                        if(response.ok) {
                            console.log('Logged in successfully!');
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
                        props.handleLogin();
                    })
                    .catch(console.error);
            }
        }, 100);
    }
    const handleLogout = () => {
    /*  Logika związana z sesją użytkownika opiera się
        na ciasteczkach po stronie klienta, więc wystarczy je usunąć */
        fetch(`https://localhost:${SERVER_PORT_HTTPS}/spotify/logout`, {
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
                    props.handleLogout();
                    console.log(data.message);
                })
                .catch(console.error);
        setLoggedIn(false);
    }
    const handleToggleProfileContextMenu = () => {
        setProfileContextMenuExpanded(prevState => !prevState);
    }
    document.body.addEventListener('click', (event) => {
        if(profileContextMenuExpanded && event.target !== document.getElementById(Styles.profilePic)) {
            setProfileContextMenuExpanded(false);
        }
    })
    // #endregion

    // #region Wywołania zwrotne (useEffect Hooks)
    useEffect(() => {
        if(Cookies.get('userID')) {
            setLoggedIn(true);
        }
        if(spotifyAuthURL === '') {
            fetch(`https://localhost:${SERVER_PORT_HTTPS}/spotify/auth-url`)
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
                    <img src = {Cookies.get('profilePicURL')} alt = {Cookies.get('userName')} id = {Styles.profilePic} onClick = {handleToggleProfileContextMenu} />
                    :
                    <button id = {Styles.btnLogin} onClick = {handleLogin}>Connect with Spotify</button>
                }
                <menu id = {Styles.profileContextMenu} style = {{maxHeight: profileContextMenuExpanded ? document.getElementById(Styles.profileContextMenu_options).offsetHeight : 0}}>
                    <ul id = {Styles.profileContextMenu_options}>
                        <Link to = '/settings'>
                            <li id = {Styles.profileContextMenu_settings} className = {Styles.profileContextMenu_option}>Settings</li>
                        </Link>
                        <li id = {Styles.profileContextMenu_disconnect} className = {Styles.profileContextMenu_option} onClick = {handleLogout}>Disconnect</li>
                    </ul>
                </menu>
            </section>
        </nav>
    );
    // #endregion
}

export default NavBar;