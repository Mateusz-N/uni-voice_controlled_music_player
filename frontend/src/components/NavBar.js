import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import homeIcon from 'resources/home.svg';
import microphone_idle from 'resources/microphone_idle.svg';
import microphone_active from 'resources/microphone_active.svg';

import SearchBar from 'components/SearchBar';

import Styles from 'components/NavBar.module.scss';

const NavBar = () => {
    // #region Zmienne stanu (useState Hooks)
    const [loggedIn, setLoggedIn] = useState(false);
    const [microphoneActive, setMicrophoneActive] = useState(false);
    const [microphoneEnabled, setMicrophoneEnabled] = useState(false);
    const [profileContextMenuExpanded, setProfileContextMenuExpanded] = useState(false);
    const [spotifyAuthURL, setSpotifyAuthURL] = useState('');
    const [activeSession, setActiveSeesion] = useState({});
    // #endregion

    // #region Obsługa zdarzeń (Event Handlers)
    const handleToggleMicrophone = () => {
        setMicrophoneEnabled(prevState => !prevState);
    }
    const handleLogin = () => {
        window.location.href = spotifyAuthURL;
    }
    const handleLogout = () => {
        setLoggedIn(false);
    }
    const handleToggleProfileContextMenu = () => {
        setProfileContextMenuExpanded(prevState => !prevState);
    }
    document.body.addEventListener("click", (event) => {
        if(profileContextMenuExpanded && event.target !== document.getElementById(Styles.profilePic)) {
            setProfileContextMenuExpanded(false);
        }
    })
    // #endregion

    // #region Wywołania zwrotne (useEffect Hooks)
    useEffect(() => {
        if(spotifyAuthURL === '') {
            fetch('http://localhost:3030/spotify/auth-url')
                .then((response) => {
                    if(response.ok) {
                        return response.json()
                    }
                })
                .then((data) => setSpotifyAuthURL(data.authURL))
                .catch(console.error);
        }
        fetch('http://localhost:3030/spotify/user', {
            method: 'GET',
            credentials: 'include'
        })
            .then((response) => {
                if(response.ok) {
                    return response.json()
                }
            })
            .then((data) => {
                if(data) {
                    setLoggedIn(true);
                    setActiveSeesion({
                        userName: data.userName,
                        profilePicURL: data.profilePicURL
                    });
                }
            })
            .catch(console.error);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
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
                    <img src = {activeSession.profilePicURL} alt = {activeSession.userName} id = {Styles.profilePic} onClick = {handleToggleProfileContextMenu} />
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