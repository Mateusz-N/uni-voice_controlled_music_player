import { useState } from 'react';

import SearchBar from './SearchBar';

import microphone_idle from '../resources/microphone_idle.svg';
import microphone_active from '../resources/microphone_active.svg';

import Styles from './NavBar.module.scss';

const NavBar = (props) => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [microphoneActive, setMicrophoneActive] = useState(false);
    const [microphoneEnabled, setMicrophoneEnabled] = useState(false);
    
    const handleToggleMicrophone = () => {
        setMicrophoneEnabled(prevState => !prevState);
    }

    const handleLogin = () => {
        setLoggedIn(prevState => !prevState);
    }

    return(
        <div id = {Styles.navBar}>
            <SearchBar>
                
            </SearchBar>
            <div id = {Styles.microphoneContainer}>
                <img
                    src = {microphoneActive ? microphone_active : microphone_idle} alt = {microphoneEnabled ? (microphoneActive ? 'Capturing voice...' : 'Awaiting input...') : 'Microphone off'}
                    id = {Styles.microphoneIcon}
                    className = {microphoneEnabled ? Styles.microphoneIcon_enabled : Styles.microphoneIcon_disabled}
                    onClick = {handleToggleMicrophone}
                />
            </div>
            { loggedIn ?
                <img src = {props.loggedUser.profilePic} alt = {props.loggedUser.name} id = {Styles.profilePic} onClick = {handleLogin} />
                :
                <button id = {Styles.btnLogin} onClick = {handleLogin}>Connect with Spotify</button>
            }
            
        </div>
    );
}

export default NavBar;