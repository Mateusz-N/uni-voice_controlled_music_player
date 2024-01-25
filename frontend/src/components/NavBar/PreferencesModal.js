import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Cookies from 'js-cookie';

import { requestUpdatePreference } from 'common/serverRequests';

import Toast from 'components/generic/Toast';
import Select from 'components/generic/Select';
import Modal from 'components/generic/Modal';

import Styles from 'components/NavBar/PreferencesModal.module.scss';

const PreferencesModal = (props) => {
    // #region Zmienne globalne
    const defaultAction = props.defaultAction;
    // #endregion

    // #region Zmienne stanu (useState Hooks)
    const [notification, setNotification] = useState({});
    // #endregion

    // #region Obsługa zdarzeń (Event Handlers)
    const handleUpdatePreference = (preferenceName, newValue) => {
        requestUpdatePreference(Cookies.get('userID'), preferenceName, newValue, (data) => {
            setNotification(data.message);
            if(data.message.type === 'success') {
                const newCookie = JSON.parse(Cookies.get('preferences'));
                newCookie[preferenceName] = newValue;
                Cookies.set('preferences', JSON.stringify(newCookie));
            }
        })
    }
    // #endregion

    // #region Funkcje pomocnicze
    const getPreferenceValueFromCookies = (preferenceName) => {
        return JSON.parse(Cookies.get('preferences'))[preferenceName];
    }
    // #endregion

    // #region Wywołania zwrotne (useEffect Hooks)
    useEffect(() => {
        if(defaultAction === 'cancel') {
            props.onClose();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[defaultAction]);
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
            <Modal title = 'Preferences' id = {'preferences'} onClose = {props.onClose} styles = {Styles}>
                <main className = {Styles.preferences_main}>
                    <ul className = {Styles.preferenceList}>
                        <li className = {Styles.preference}>
                            <span className = {Styles.preferences_preferenceName}>Synchronize with Spotify automatically: </span>
                            <Select
                                id = {Styles['preference_autoSync']}
                                name = 'autoSync'
                                defaultValue = {getPreferenceValueFromCookies('auto_spotify_sync') === 1 ? 'yes' : 'no'}
                                children = {[{
                                    option: {
                                        attributes: {
                                            name: 'yes',
                                            value: 'yes'
                                        },
                                        content: 'yes'
                                }}, {
                                    option: {
                                        attributes: {
                                            name: 'no',
                                            value: 'no'
                                        },
                                        content: 'no'
                                    }
                                }]}
                                onSelection = {(selectedValue) => handleUpdatePreference('auto_spotify_sync', selectedValue === 'yes' ? 1 : 0)}
                            />
                        </li>
                        <li className = {Styles.preference}>
                            <span className = {Styles.preferences_preferenceName}>Default voice input state: </span>
                            <Select
                                id = {Styles['preference_defaultVoiceInputState']}
                                name = 'defaultVoiceInputState'
                                defaultValue = {getPreferenceValueFromCookies('default_voice_input_enabled') === 1 ? 'yes' : 'no'}
                                children = {[{
                                    option: {
                                        attributes: {
                                            name: 'enabled',
                                            value: 'enabled'
                                        },
                                        content: 'enabled'
                                }}, {
                                    option: {
                                        attributes: {
                                            name: 'disabled',
                                            value: 'disabled'
                                        },
                                        content: 'disabled'
                                    }
                                }]}
                                onSelection = {(selectedValue) => handleUpdatePreference('default_voice_input_enabled', selectedValue === 'yes' ? 1 : 0)}
                            />
                        </li>
                    </ul>
                </main>
            </Modal>
        </>
    );
    // #endregion
}

export default PreferencesModal;