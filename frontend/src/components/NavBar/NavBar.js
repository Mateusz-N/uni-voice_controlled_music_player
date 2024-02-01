import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

import { requestGetUserProfile, requestLogout, requestSpotifyAuthURL } from 'common/serverRequests';

import homeIcon from 'resources/home.svg';
import logo_spotify from 'resources/Spotify_Logo_RGB_Green.png'

import Microphone from 'components/Microphone';
import SearchBar from 'components/generic/SearchBar';
import ContextMenu from 'components/generic/ContextMenu';
import AboutModal from 'components/NavBar/AboutModal';
import PreferencesModal from 'components/NavBar/PreferencesModal';
import Toast from 'components/generic/Toast';

import Styles from 'components/NavBar/NavBar.module.scss';

const NavBar = (props) => {
    // #region Zmienne globalne
    const defaultFormAction = props.defaultFormAction;
    const defaultSearchQuery = props.defaultSearchQuery;
    // #endregion

    // #region Zmienne stanu (useState Hooks)
    const [loggedIn, setLoggedIn] = useState(false);
    const [profileContextMenuExpanded, setProfileContextMenuExpanded] = useState(false);
    const [spotifyAuthURL, setSpotifyAuthURL] = useState(null);
    const [modal_about_open, setModal_about_open] = useState(false);
    const [modal_preferences_open, setModal_preferences_open] = useState(false);
    const [defaultPreference, setDefaultPreference] = useState(null);
    const [notification, setNotification] = useState({});
    // #endregion

    // #region Zmienne referencji (useRef Hooks)
    const ref_profilePic = useRef(null);
    // #endregion

    // #region Zmienne nawigacji (useNavigate Hooks)
    const navigate = useNavigate();
    // #endregion

    // #region Obsługa zdarzeń (Event Handlers)
    const handleLogin = () => {
    /*  Otwarcie wyskakującego okienka z autoryzacją w serwisie Spotify */
        if(loggedIn || !spotifyAuthURL) {
            return;
        }
        const popup = window.open(spotifyAuthURL, '_blank');
        const checkPopup = setInterval(() => {
            if(popup && popup.closed) {
                clearInterval(checkPopup);
                requestGetUserProfile((data) => {
                    Cookies.set('userID', data.userID, {secure: true, sameSite: 'strict'});
                    Cookies.set('userName', data.userName, {secure: true, sameSite: 'strict'});
                    Cookies.set('profilePicURL', data.profilePicURL, {secure: true, sameSite: 'strict'});
                    Cookies.set('preferences', JSON.stringify(data.preferences), {secure: true, sameSite: 'strict'});
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
        if(!loggedIn) {
            return;
        }
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
        if(profileContextMenuExpanded && ((ref_profilePic.current && event.target !== ref_profilePic.current) || event.target.className.includes(Styles.profile_contextMenu_option))) {
            setProfileContextMenuExpanded(false);
        }
    }
    const handleSearchFormSubmit = (query) => {
        props.onSearch();
        navigate(`/search?query=${query}`);
        // navigate(url) aktualizuje URL w pasku wyszukiwania, lecz nie wczytuje strony, gdy nowy URL różni się od obecnego tylko parametrami
        // Z tego powodu należy wywołać dodatkowo navigate(0), czyli odświeżenie bieżącej strony
        navigate(0);
    }
    const handleSelectAbout = () => {
        setModal_about_open(true);
    }
    const handleSelectPreferences = () => {
        setModal_preferences_open(true);
    }
    const handleModalClose_about = () => {
        setModal_about_open(false);
        props.onFormActionVoiceCommand(null);
    }
    const handleModalClose_preferences = () => {
        setModal_preferences_open(false);
        props.onFormActionVoiceCommand(null);
    }
    const handleTogglePreferenceVoiceCommand = (preferenceName, newValue) => {
        setDefaultPreference({name: preferenceName, value: newValue});
    }
    const handlePreferenceChange = () => {
        setDefaultPreference(null);
    }
    const handleReturnHome = () => {
        navigate('/');
    }
    // #endregion

    // #region Wywołania zwrotne (useEffect Hooks)
    useEffect(() => {
        if(Cookies.get('userID')) {
            setLoggedIn(true);
        }
        requestSpotifyAuthURL((data) => {
            setSpotifyAuthURL(data.authURL);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);
    useEffect(() => {
        document.body.addEventListener('click', handleClickOutsideProfileContextMenu);
        return () => {
            document.body.removeEventListener('click', handleClickOutsideProfileContextMenu);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[profileContextMenuExpanded]);
    useEffect(() => {
        if(!defaultSearchQuery) {
            return;
        }
        handleSearchFormSubmit(defaultSearchQuery)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[defaultSearchQuery]);
    // #endregion

    // #region Przypisanie dynamicznych elementów komponentu
    let modal_about = null;
    if(modal_about_open) {
        modal_about =
            createPortal(<AboutModal
                defaultAction = {defaultFormAction}
                onClose = {handleModalClose_about}
            />, document.body);
    }
    let modal_preferences = null;
    if(modal_preferences_open) {
        modal_preferences =
            createPortal(<PreferencesModal
                defaultPreference = {defaultPreference}
                defaultAction = {defaultFormAction}
                onClose = {handleModalClose_preferences}
                onPreferenceChange = {handlePreferenceChange}
            />, document.body);
    }
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
                        <img src = {homeIcon} alt = 'Home' id = {Styles.homeIcon} data-cy = 'btnHome' />
                    </Link>
                    <SearchBar defaultSearchQuery = {defaultSearchQuery} onSubmit = {(query) => handleSearchFormSubmit(query)} />
                </section>
                <div id = {Styles.microphoneContainer}>
                    <Microphone
                        onLoginVoiceCommand = {handleLogin}
                        onLogoutVoiceCommand = {handleLogout}
                        onSyncWithSpotifyVoiceCommand = {props.onSyncWithSpotifyVoiceCommand}
                        onReturnHomeVoiceCommand = {handleReturnHome}
                        onTogglePlaylistPlaybackVoiceCommand = {props.onTogglePlaylistPlaybackVoiceCommand}
                        onToggleTrackPlaybackVoiceCommand = {props.onToggleTrackPlaybackVoiceCommand}
                        onShowTrackDetailsVoiceCommand = {props.onShowTrackDetailsVoiceCommand}
                        onTrackInPlaylistVoiceCommand = {props.onTrackInPlaylistVoiceCommand}
                        onShowItemDetailsVoiceCommand = {props.onShowItemDetailsVoiceCommand}
                        onShowLyricsVoiceCommand = {props.onShowLyricsVoiceCommand}
                        onSearchVoiceCommand = {props.onSearchVoiceCommand}
                        onShowItemVoiceCommand = {props.onShowItemVoiceCommand}
                        onCreatePlaylistVoiceCommand = {props.onCreatePlaylistVoiceCommand}
                        onModifyPlaylistVoiceCommand = {props.onModifyPlaylistVoiceCommand}
                        onGeneratePlaylistVoiceCommand = {props.onGeneratePlaylistVoiceCommand}
                        onDeletePlaylistVoiceCommand = {props.onDeletePlaylistVoiceCommand}
                        onFormActionVoiceCommand = {props.onFormActionVoiceCommand}
                        onToggleSelectVoiceCommand = {props.onToggleSelectVoiceCommand}
                        onShowAboutModalVoiceCommand = {handleSelectAbout}
                        onShowPreferencesModalVoiceCommand = {handleSelectPreferences}
                        onTogglePreference = {handleTogglePreferenceVoiceCommand}
                        onAddPlaylistGeneratorSeedVoiceCommand = {props.onAddPlaylistGeneratorSeedVoiceCommand}
                        onRemovePlaylistGeneratorSeedVoiceCommand = {props.onRemovePlaylistGeneratorSeedVoiceCommand}
                        onChangePlaylistGeneratorSeedTypeVoiceCommand = {props.onChangePlaylistGeneratorSeedTypeVoiceCommand}
                        onSelectPlaylistGeneratorSeedVoiceCommand = {props.onSelectPlaylistGeneratorSeedVoiceCommand}
                        onSetPlaylistGeneratorParameterVoiceCommand = {props.onSetPlaylistGeneratorParameterVoiceCommand}
                        deps = {[spotifyAuthURL, loggedIn]}
                    />
                </div>
                <section id = {Styles.navBar_rightSection} className = {Styles.navBar_section}>
                    <p id = {Styles.spotifyAttribution}>
                        Powered by
                        <Link to = 'https://open.spotify.com/'>
                            <img src = {logo_spotify} alt = 'Spotify' id = {Styles.spotifyLogo} />
                        </Link>
                    </p>
                    {loggedIn ?
                        <img
                            src = {Cookies.get('profilePicURL')}
                            alt = {Cookies.get('userName')}
                            id = {Styles.profilePic}
                            onClick = {handleToggleProfileContextMenu}
                            ref = {ref_profilePic}
                        />
                        :
                        <button id = {Styles.btnLogin} className = 'btnPrimary' data-cy = 'btnLogin' onClick = {handleLogin}>Connect with Spotify</button>
                    }
                    {modal_about}
                    {modal_preferences}
                    <ContextMenu expanded = {profileContextMenuExpanded} context = 'profile' styles = {Styles}>
                        <li id = {Styles.profileContextMenu_about} onClick = {handleSelectAbout}>About</li>
                        <li id = {Styles.profileContextMenu_settings} onClick = {handleSelectPreferences}>Preferences</li>
                        <li id = {Styles.profileContextMenu_disconnect} onClick = {handleLogout} dangerous = 'true'>Disconnect</li>
                    </ContextMenu>
                </section>
            </nav>
        </>
    );
    // #endregion
}

export default NavBar;