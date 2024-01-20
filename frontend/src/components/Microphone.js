import { useState, useEffect, useRef} from 'react';
import { createPortal } from 'react-dom';

import microphone_idle from 'resources/microphone_idle.svg';
import microphone_active from 'resources/microphone_active.svg';

import Toast from 'components/generic/Toast';

import Styles from 'components/Microphone.module.scss';

const Microphone = (props) => {
    // #region Zmienne globalne
    const deps = props.deps;
    // #endregion

    // #region Zmienne stanu (useState Hooks)
    const [microphoneEnabled, setMicrophoneEnabled] = useState(localStorage.getItem('microphoneEnabled') === 'true');
    const [microphoneActive, setMicrophoneActive] = useState(localStorage.getItem('microphoneActive') === 'true');
    const [notification, setNotification] = useState({});

    // #region Zmienne referencji (useRef Hooks)
    const ref_recognition = useRef(null);
    const ref_microphoneEnabled = useRef(localStorage.getItem('microphoneEnabled') === 'true');
    const ref_microphoneActive = useRef(localStorage.getItem('microphoneActive') === 'true');
    // #endregion

    // #region Obsługa zdarzeń (Event Handlers)
    const handleToggleMicrophone = () => {
        ref_microphoneEnabled.current = !ref_microphoneEnabled.current;
        setMicrophoneEnabled(prevState => !prevState);
        localStorage.setItem('microphoneEnabled', (ref_microphoneEnabled.current.toString()));
    }
    const handleEnableVoiceInput = () => {
        if(!ref_recognition.current) {
            return;
        }
        try {
            ref_recognition.current.start();
            localStorage.setItem('microphoneEnabled', 'true');
        }
        catch(error) {
            console.error(error);
        }
    }
    const handleDisableVoiceInput = () => {
        if(!ref_recognition.current) {
            return;
        }
        localStorage.setItem('microphoneEnabled', 'false');
        ref_recognition.current.onend = null;
        ref_recognition.current.stop();
    }
    // #endregion

    // #region Funkcje pomocnicze
    const setupSpeechRecognition = () => {
        const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
        const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;
        const commands = ['wyłącz mikrofon', 'zaloguj', 'wyloguj', 'odśwież katalog', 'strona główna', 'pokaż katalog'];
        const grammar = '#JSGF V1.0; grammar commands; public <commands> = ' + commands.join(' | ') + ';';
        const recognition = new SpeechRecognition();
        const recognitionList = new SpeechGrammarList();
        recognitionList.addFromString(grammar, 1);
        recognition.grammars = recognitionList;
        recognition.lang = 'pl-PL';
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        ref_recognition.current = recognition;
    }
    const setRecognitionEventListeners = () => {
        ref_recognition.current.onspeechstart = () => {
            console.log('speechstart')
            if(ref_microphoneEnabled.current) {
                activateMicrophone();
            }
        }
        ref_recognition.current.onspeechend = () => {
            console.log('speechend');
            if(ref_microphoneEnabled.current) {
                deactivateMicrophone();
            }
        }
        ref_recognition.current.onend = () => {
            console.log('end')
            // Włącz ponownie w przypadku automatycznego wyłączenia po chwili nieaktywności
            if(ref_microphoneEnabled.current) {
                handleEnableVoiceInput();
            }
        }
        ref_recognition.current.onresult = (event) => {
            console.log('result')
            if(ref_microphoneEnabled.current) {
                deactivateMicrophone();
            }
            const command = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
            console.log(command)
            switchSpeechCommand(command);
            console.log("You said: " + command);
        }
        ref_recognition.current.onnomatch = () => {
            console.log('nomatch')
            setNotification({message: 'Unrecognized voice command. Please try again.', type: 'error'});
        }
        ref_recognition.current.onerror = (error) => {
            if(error.error === 'no-speech') {
                console.warn(
                    'No speech detected!',
                    'If you are not speaking right now, you may safely disregard this warning.',
                    'Otherwise, check your microphone or browser settings and make sure the microphone button is turned on.'
                );
                return;
            }
            console.error(error);
        }
    }
    const switchSpeechCommand = (command) => {
        try {
            if(command === 'wyłącz mikrofon') {
                ref_microphoneEnabled.current = false;
                setMicrophoneEnabled(false);
                return;
            }
            if(command === 'zaloguj') {
                props.onLoginVoiceCommand();
                return;
            }
            if(command === 'wyloguj') {
                props.onLogoutVoiceCommand();
                return;
            }
            if(command === 'synchronizuj') {
                props.onSyncWithSpotifyVoiceCommand();
                return;
            }
            if(['strona główna', 'pokaż katalog'].includes(command)) {
                props.onReturnHomeVoiceCommand();
                return;
            }
            if(command.startsWith('szukaj')) {
                props.onSearchVoiceCommand(getCommandParameter(command, 'szukaj'));
            }
            if(command.startsWith('pokaż playlistę')) {
                props.onShowPlaylistVoiceCommand(getCommandParameter(command, 'pokaż playlistę'));
            }
            if(command.startsWith('pokaż album')) {
                props.onShowAlbumVoiceCommand(getCommandParameter(command, 'pokaż album'));
            }
            if(command.startsWith('pokaż wykonawcę')) {
                props.onShowArtistVoiceCommand(getCommandParameter(command, 'pokaż wykonawcę'));
            }
            if(['utwórz playlistę', 'nowa playlista', 'stwórz playlistę'].includes(command)) {
                props.onCreatePlaylistVoiceCommand();
            }
            if(['generuj playlistę', 'otwórz generator'].includes(command)) {
                props.onGeneratePlaylistVoiceCommand();
            }
            if(command.startsWith('usuń playlistę')) {
                props.onDeletePlaylistVoiceCommand(getCommandParameter(command, 'usuń playlistę'));
            }
            if(['ok', 'okej', 'zatwierdź', 'potwierdź', 'tak', 'wyślij'].includes(command)) {
                props.onSubmitFormVoiceCommand();
            }
            if(['anuluj', 'nie', 'zamknij'].includes(command)) {
                props.onCancelFormVoiceCommand();
            }
            if(['o aplikacji', 'o stronie', 'informacje o aplikacji', 'informacje o stronie'].includes(command)) {
                props.onShowAboutPageVoiceCommand();
            }
            if(['dodaj ziarno', 'nowe ziarno'].includes(command)) {
                props.onAddPlaylistGeneratorSeedVoiceCommand();
            }
            if(command.startsWith('usuń ziarno')) {
                props.onRemovePlaylistGeneratorSeedVoiceCommand(getCommandParameter(command, 'usuń ziarno'));
            }
            if(command.startsWith('typ ziarna')) {
                props.onChangePlaylistGeneratorSeedTypeVoiceCommand(getCommandParameter(command, 'typ ziarna'));
            }
            setNotification({message: 'Unrecognized voice command. Please try again.', type: 'error'});
        }
        catch(error) {
            console.error(error);
            setNotification({message: 'Something went wrong. Please make sure you are issuing the command from a valid context.', type: 'error'});
        }
    }
    const activateMicrophone = () => {
        ref_microphoneActive.current = true;
        setMicrophoneActive(true);
        localStorage.setItem('microphoneActive', 'true');
    }
    const deactivateMicrophone = () => {
        ref_microphoneActive.current = false;
        setMicrophoneActive(false);
        localStorage.setItem('microphoneActive', 'false');
    }
    const getCommandParameter = (command, delimiter) => {
        return command.split(delimiter).slice(1).join(delimiter);
    }
    // #endregion

    // #region Wywołania zwrotne (useEffect Hooks)
    useEffect(() => {
        setupSpeechRecognition();
    },[]);
    useEffect(() => {
        if(ref_microphoneEnabled.current === true) {
            handleEnableVoiceInput();
            return;
        }
        if(ref_microphoneEnabled.current === false) {
            handleDisableVoiceInput();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[ref_microphoneEnabled.current, ref_recognition.current]);
    useEffect(() => {
        if(ref_recognition.current) {
            setRecognitionEventListeners();
        }
        return () => {
            if(ref_recognition.current) {
                ref_recognition.current.onspeechstart = null;
                ref_recognition.current.onspeechend = null;
                ref_recognition.current.onresult = null;
                ref_recognition.current.onend = null;
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[...deps, ref_microphoneActive.current, ref_microphoneEnabled.current]);
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
            <img
                src = {microphoneActive ? microphone_active : microphone_idle}
                alt = {microphoneEnabled ? (ref_microphoneActive.current ? 'Capturing voice...' : 'Awaiting input...') : 'Microphone off'}
                id = {Styles.microphoneIcon}
                className = {microphoneEnabled ? Styles.microphoneIcon_enabled : Styles.microphoneIcon_disabled}
                onClick = {handleToggleMicrophone}
            />
        </>
    );
    // #endregion
}

export default Microphone;