import { useState } from 'react';

import SearchBar from './SearchBar';

import homeIcon from '../resources/home.svg';
import microphone_idle from '../resources/microphone_idle.svg';
import microphone_active from '../resources/microphone_active.svg';

import Styles from './NavBar.module.scss';

const NavBar = (props) => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [microphoneActive, setMicrophoneActive] = useState(false);
    const [microphoneEnabled, setMicrophoneEnabled] = useState(false);
    const [profileContextMenuExpanded, setProfileContextMenuExpanded] = useState(false);
    
    const handleOpenHomePage = () => {
        // to-do
    }
    const handleToggleMicrophone = () => {
        setMicrophoneEnabled(prevState => !prevState);
    }
    const handleLogin = () => {
        setLoggedIn(true);
    }
    const handleLogout = () => {
        setLoggedIn(false);
    }
    const handleToggleProfileContextMenu = () => {
        setProfileContextMenuExpanded(prevState => !prevState);
    }
    const handleOpenSettingsMenu = () => {
        // to-do
    }
    document.body.addEventListener("click", (event) => {
        if(profileContextMenuExpanded && event.target !== document.getElementById(Styles.profilePic)) {
            setProfileContextMenuExpanded(false);
        }
    })

    return(
        <nav id = {Styles.navBar}>
            <section id = {Styles.navBar_leftSection} className = {Styles.navBar_section}>
                <img src = {homeIcon} alt = 'Home' id = {Styles.homeIcon} onClick = {handleOpenHomePage} />
                <SearchBar>
                    
                </SearchBar>
            </section>
            <div id = {Styles.microphoneContainer}>
                <img
                    src = {microphoneActive ? microphone_active : microphone_idle} alt = {microphoneEnabled ? (microphoneActive ? 'Capturing voice...' : 'Awaiting input...') : 'Microphone off'}
                    id = {Styles.microphoneIcon}
                    className = {microphoneEnabled ? Styles.microphoneIcon_enabled : Styles.microphoneIcon_disabled}
                    onClick = {handleToggleMicrophone}
                />
            </div>
            <section id = {Styles.navBar_rightSection} className = {Styles.navBar_section}>
                { loggedIn ?
                    <img src = {props.loggedUser.profilePic} alt = {props.loggedUser.name} id = {Styles.profilePic} onClick = {handleToggleProfileContextMenu} />
                    :
                    <button id = {Styles.btnLogin} onClick = {handleLogin}>Connect with Spotify</button>
                }
                <menu id = {Styles.profileContextMenu} style = {{maxHeight: profileContextMenuExpanded ? document.getElementById(Styles.profileContextMenu_options).offsetHeight : 0}}>
                    <ul id = {Styles.profileContextMenu_options}>
                        <li id = {Styles.profileContextMenu_settings} className = {Styles.profileContextMenu_option} onClick = {handleOpenSettingsMenu}>Settings</li>
                        <li id = {Styles.profileContextMenu_disconnect} className = {Styles.profileContextMenu_option} onClick = {handleLogout}>Disconnect</li>
                    </ul>
                </menu>
            </section>
        </nav>
    );
}

export default NavBar;