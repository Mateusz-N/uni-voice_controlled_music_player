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
        const commands = [
            'wyłącz mikrofon', 'zaloguj', 'wyloguj', 'synchronizuj', 'strona główna', 'pokaż katalog', 'szukaj', 'pokaż playlistę', 'pokaż album', 'pokaż wykonawcę',
            'utwórz playlistę', 'nowa playlista', 'stwórz playlistę', 'generuj playlistę', 'otwórz generator', 'usuń playlistę', 'ok', 'okej', 'zatwierdź', 'potwierdź', 'tak',
            'wyślij', 'anuluj', 'nie', 'zamknij', 'o aplikacji', 'o stronie', 'informacje o aplikacji', 'informacje o stronie', 'dodaj ziarno', 'nowe ziarno', 'usuń ziarno',
            'typ ziarna', 'wybierz', 'minimalna akustyczność', 'docelowa akustyczność', 'maksymalna akustyczność'
        ];
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
            switchSpeechCommand(command);
            console.log('You said: "' + command + '"');
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
                return;
            }
            if(command.startsWith('pokaż playlistę')) {
                props.onShowItemVoiceCommand('playlist', getCommandParameter(command, 'pokaż playlistę'));
                return;
            }
            if(command.startsWith('pokaż album')) {
                props.onShowItemVoiceCommand('album', getCommandParameter(command, 'pokaż album'));
                return;
            }
            if(command.startsWith('pokaż wykonawcę')) {
                props.onShowItemVoiceCommand('artist', getCommandParameter(command, 'pokaż wykonawcę'));
                return;
            }
            if(['utwórz playlistę', 'nowa playlista', 'stwórz playlistę'].includes(command)) {
                props.onCreatePlaylistVoiceCommand();
                return;
            }
            if(['generuj playlistę', 'otwórz generator'].includes(command)) {
                props.onGeneratePlaylistVoiceCommand();
                return;
            }
            if(command.startsWith('usuń playlistę')) {
                props.onDeletePlaylistVoiceCommand(getCommandParameter(command, 'usuń playlistę'));
                return;
            }
            if(['ok', 'okej', 'zatwierdź', 'potwierdź', 'tak', 'wyślij'].includes(command)) {
                props.onFormActionVoiceCommand('submit');
                return;
            }
            if(['anuluj', 'nie', 'zamknij'].includes(command)) {
                props.onFormActionVoiceCommand('cancel');
                return;
            }
            if(['o aplikacji', 'o stronie', 'informacje o aplikacji', 'informacje o stronie'].includes(command)) {
                props.onShowAboutPageVoiceCommand();
                return;
            }
            if(['dodaj ziarno', 'nowe ziarno'].includes(command)) {
                props.onAddPlaylistGeneratorSeedVoiceCommand();
                return;
            }
            if(['odtwarzaj', 'odtwórz', 'wznów'].includes(command.split(' ')[0])) {
                parsePlaybackToggleCommand(command, 'play');
                return;
            }
            if(['zatrzymaj', 'zapauzuj', 'pauzuj'].includes(command.split(' ')[0])) {
                parsePlaybackToggleCommand(command, 'pause');
                return;
            }
            if(command.startsWith('pokaż szczegóły utworu')) {
                parseShowTrackDetailsCommand(command);
                return;
            }
            if(command === 'pokaż tekst') {
                props.onShowLyricsVoiceCommand();
                return;
            }
            if(command === 'pokaż szczegóły albumu') {
                props.onShowItemDetailsVoiceCommand('album');
                return;
            }
            if(command === 'pokaż szczegóły wykonawcy') {
                props.onShowItemDetailsVoiceCommand('artist');
                return;
            }
            if(command.startsWith('zmień nazwę playlisty na')) {
                props.onModifyPlaylistVoiceCommand('Name', getCommandParameter(command, 'zmień nazwę playlisty na'));
                return;
            }
            if(command === 'zmień playlistę na publiczną') {
                props.onModifyPlaylistVoiceCommand('Public', 'yes');
                return;
            }
            if(command === 'zmień playlistę na prywatną') {
                props.onModifyPlaylistVoiceCommand('Public', 'no');
                return;
            }
            if(command.startsWith('zmień opis playlisty na')) {
                props.onModifyPlaylistVoiceCommand('Description', getCommandParameter(command, 'zmień opis playlisty na'));
                return;
            }
            if(command.startsWith('usuń ziarno')) {
                props.onRemovePlaylistGeneratorSeedVoiceCommand(getCommandParameter(command, 'usuń ziarno'));
                return;
            }
            if(command.startsWith('typ ziarna')) {
                props.onChangePlaylistGeneratorSeedTypeVoiceCommand(getCommandParameter(command, 'typ ziarna'));
                return;
            }
            if(command.startsWith('wybierz')) {
                props.onSelectPlaylistGeneratorSeedVoiceCommand(getCommandParameter(command, 'wybierz'));
                return;
            }
            if(command.startsWith('minimalna akustyczn')) { // Web Speech API nie radzi sobie z słowami jak 'akustyczność'...
                props.onSetPlaylistGeneratorParameterVoiceCommand('min_acousticness', getCommandParameter(command, 'minimalna akustyczn', true));
                return;
            }
            if(command.startsWith('docelowa akustyczn')) {
                props.onSetPlaylistGeneratorParameterVoiceCommand('target_acousticness', getCommandParameter(command, 'docelowa akustyczn', true));
                return;
            }
            if(command.startsWith('maksymalna akustyczn')) {
                props.onSetPlaylistGeneratorParameterVoiceCommand('max_acousticness', getCommandParameter(command, 'maksymalna akustyczn', true));
                return;
            }
            if(command.startsWith('minimalna taneczn')) {
                props.onSetPlaylistGeneratorParameterVoiceCommand('min_danceability', getCommandParameter(command, 'minimalna taneczn', true));
                return;
            }
            if(command.startsWith('docelowa taneczn')) {
                props.onSetPlaylistGeneratorParameterVoiceCommand('target_danceability', getCommandParameter(command, 'docelowa taneczn', true));
                return;
            }
            if(command.startsWith('maksymalna taneczn')) {
                props.onSetPlaylistGeneratorParameterVoiceCommand('max_danceability', getCommandParameter(command, 'maksymalna taneczn', true));
                return;
            }
            if(command.startsWith('minimalna długość')) {
                props.onSetPlaylistGeneratorParameterVoiceCommand('min_track_duration_ms', getCommandParameter(command, 'minimalna długość'));
                return;
            }
            if(command.startsWith('docelowa długość')) {
                props.onSetPlaylistGeneratorParameterVoiceCommand('target_track_duration_ms', getCommandParameter(command, 'docelowa długość'));
                return;
            }
            if(command.startsWith('maksymalna długość')) {
                props.onSetPlaylistGeneratorParameterVoiceCommand('max_track_duration_ms', getCommandParameter(command, 'maksymalna długość'));
                return;
            }
            if(command.startsWith('minimalna energia')) {
                props.onSetPlaylistGeneratorParameterVoiceCommand('min_energy', getCommandParameter(command, 'minimalna energia'));
                return;
            }
            if(command.startsWith('docelowa energia')) {
                props.onSetPlaylistGeneratorParameterVoiceCommand('target_energy', getCommandParameter(command, 'docelowa energia'));
                return;
            }
            if(command.startsWith('maksymalna energia')) {
                props.onSetPlaylistGeneratorParameterVoiceCommand('max_energy', getCommandParameter(command, 'maksymalna energia'));
                return;
            }
            if(command.startsWith('minimalna instrumentaln')) {
                props.onSetPlaylistGeneratorParameterVoiceCommand('min_instrumentalness', getCommandParameter(command, 'minimalna instrumentaln', true));
                return;
            }
            if(command.startsWith('docelowa instrumentaln')) {
                props.onSetPlaylistGeneratorParameterVoiceCommand('target_instrumentalness', getCommandParameter(command, 'docelowa instrumentaln', true));
                return;
            }
            if(command.startsWith('maksymalna instrumentaln')) {
                props.onSetPlaylistGeneratorParameterVoiceCommand('max_instrumentalness', getCommandParameter(command, 'maksymalna instrumentaln', true));
                return;
            }
            if(command.startsWith('minimalna tonacja')) {
                props.onSetPlaylistGeneratorParameterVoiceCommand('min_key', getCommandParameter(command, 'minimalna tonacja'));
                return;
            }
            if(command.startsWith('docelowa tonacja')) {
                props.onSetPlaylistGeneratorParameterVoiceCommand('target_key', getCommandParameter(command, 'docelowa tonacja'));
                return;
            }
            if(command.startsWith('maksymalna tonacja')) {
                props.onSetPlaylistGeneratorParameterVoiceCommand('max_key', getCommandParameter(command, 'maksymalna tonacja'));
                return;
            }
            if(command.startsWith('minimalna żywość')) {
                props.onSetPlaylistGeneratorParameterVoiceCommand('min_liveness', getCommandParameter(command, 'minimalna żywość'));
                return;
            }
            if(command.startsWith('docelowa żywość')) {
                props.onSetPlaylistGeneratorParameterVoiceCommand('target_liveness', getCommandParameter(command, 'docelowa żywość'));
                return;
            }
            if(command.startsWith('maksymalna żywość')) {
                props.onSetPlaylistGeneratorParameterVoiceCommand('max_liveness', getCommandParameter(command, 'maksymalna żywość'));
                return;
            }
            if(command.startsWith('minimalna żywność')) {
                props.onSetPlaylistGeneratorParameterVoiceCommand('min_liveness', getCommandParameter(command, 'minimalna żywność'));
                return;
            }
            if(command.startsWith('docelowa żywność')) {
                props.onSetPlaylistGeneratorParameterVoiceCommand('target_liveness', getCommandParameter(command, 'docelowa żywność'));
                return;
            }
            if(command.startsWith('maksymalna żywność')) {
                props.onSetPlaylistGeneratorParameterVoiceCommand('max_liveness', getCommandParameter(command, 'maksymalna żywność'));
                return;
            }
            if(command.startsWith('minimalna głośność')) {
                props.onSetPlaylistGeneratorParameterVoiceCommand('min_loudness', getCommandParameter(command, 'minimalna głośność'));
                return;
            }
            if(command.startsWith('docelowa głośność')) {
                props.onSetPlaylistGeneratorParameterVoiceCommand('target_loudness', getCommandParameter(command, 'docelowa głośność'));
                return;
            }
            if(command.startsWith('maksymalna głośność')) {
                props.onSetPlaylistGeneratorParameterVoiceCommand('max_loudness', getCommandParameter(command, 'maksymalna głośność'));
                return;
            }
            if(command.startsWith('minimalna skala')) {
                props.onSetPlaylistGeneratorParameterVoiceCommand('min_mode', getCommandParameter(command, 'minimalna skala'));
                return;
            }
            if(command.startsWith('docelowa skala')) {
                props.onSetPlaylistGeneratorParameterVoiceCommand('target_mode', getCommandParameter(command, 'docelowa skala'));
                return;
            }
            if(command.startsWith('maksymalna skala')) {
                props.onSetPlaylistGeneratorParameterVoiceCommand('max_mode', getCommandParameter(command, 'maksymalna skala'));
                return;
            }
            if(command.startsWith('minimalna popularność')) {
                props.onSetPlaylistGeneratorParameterVoiceCommand('min_popularity', getCommandParameter(command, 'minimalna popularność'));
                return;
            }
            if(command.startsWith('docelowa popularność')) {
                props.onSetPlaylistGeneratorParameterVoiceCommand('target_popularity', getCommandParameter(command, 'docelowa popularność'));
                return;
            }
            if(command.startsWith('maksymalna popularność')) {
                props.onSetPlaylistGeneratorParameterVoiceCommand('max_popularity', getCommandParameter(command, 'maksymalna popularność'));
                return;
            }
            if(command.startsWith('minimalna mowa')) {
                props.onSetPlaylistGeneratorParameterVoiceCommand('min_speechiness', getCommandParameter(command, 'minimalna mowa'));
                return;
            }
            if(command.startsWith('docelowa mowa')) {
                props.onSetPlaylistGeneratorParameterVoiceCommand('target_speechiness', getCommandParameter(command, 'docelowa mowa'));
                return;
            }
            if(command.startsWith('maksymalna mowa')) {
                props.onSetPlaylistGeneratorParameterVoiceCommand('max_speechiness', getCommandParameter(command, 'maksymalna mowa'));
                return;
            }
            if(command.startsWith('minimalne tempo')) {
                props.onSetPlaylistGeneratorParameterVoiceCommand('min_tempo', getCommandParameter(command, 'minimalne tempo'));
                return;
            }
            if(command.startsWith('docelowe tempo')) {
                props.onSetPlaylistGeneratorParameterVoiceCommand('target_tempo', getCommandParameter(command, 'docelowe tempo'));
                return;
            }
            if(command.startsWith('maksymalne tempo')) {
                props.onSetPlaylistGeneratorParameterVoiceCommand('max_tempo', getCommandParameter(command, 'maksymalne tempo'));
                return;
            }
            if(command.startsWith('minimalne metrum')) {
                props.onSetPlaylistGeneratorParameterVoiceCommand('min_time_signature', getCommandParameter(command, 'minimalne metrum'));
                return;
            }
            if(command.startsWith('docelowe metrum')) {
                props.onSetPlaylistGeneratorParameterVoiceCommand('target_time_signature', getCommandParameter(command, 'docelowe metrum'));
                return;
            }
            if(command.startsWith('maksymalne metrum')) {
                props.onSetPlaylistGeneratorParameterVoiceCommand('max_time_signature', getCommandParameter(command, 'maksymalne metrum'));
                return;
            }
            if(command.startsWith('minimalna pozytywność')) {
                props.onSetPlaylistGeneratorParameterVoiceCommand('min_valence', getCommandParameter(command, 'minimalna pozytywność'));
                return;
            }
            if(command.startsWith('docelowa pozytywność')) {
                props.onSetPlaylistGeneratorParameterVoiceCommand('target_valence', getCommandParameter(command, 'docelowa pozytywność'));
                return;
            }
            if(command.startsWith('maksymalna pozytywność')) {
                props.onSetPlaylistGeneratorParameterVoiceCommand('max_valence', getCommandParameter(command, 'maksymalna pozytywność'));
                return;
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
    const getCommandParameter = (command, delimiter, autocompleteCommand = false) => {
        const parameter = command.split(delimiter).slice(1);
        if(autocompleteCommand) {
            // Jeśli `delimiter` jest niepełną frazą, utnij końcówkę faktycznie wypowiedzianej frazy
            // Pomaga w parsowaniu fraz, których Web Speech API nie potrafi zinterpretować w ich pełnej formie (np. nazwy własne)
            parameter[0] = parameter[0].slice(parameter[0].indexOf(' '));
        }
        return parameter.join(delimiter).trim();
    }
    const parseShowTrackDetailsCommand = (command) => {
        const commandSplitBySpace = command.split(' ');
        if(commandSplitBySpace[3] === 'numer') {
            commandSplitBySpace[3] = 'nr';
        }
        let commandParameterDelimiter = 'utworu';
        if(commandSplitBySpace.length > 3 && commandSplitBySpace[3] === 'nr') {
            commandParameterDelimiter = 'utworu nr';
        }
        props.onShowTrackDetailsVoiceCommand(getCommandParameter(commandSplitBySpace.slice(2).join(' '), commandParameterDelimiter));
    }
    const parsePlaybackToggleCommand = (command, targetPlaybackState) => {
        const commandSplitBySpace = command.split(' ');
        if(commandSplitBySpace[1] === 'playlistę') {
            props.onTogglePlaylistPlaybackVoiceCommand(targetPlaybackState);
            return;
        }
        if(commandSplitBySpace[1] === 'utwór') {
            if(commandSplitBySpace[2] === 'numer') {
                commandSplitBySpace[2] = 'nr';
            }
            let commandParameterDelimiter = 'utwór';
            if(commandSplitBySpace.length > 2 && commandSplitBySpace[2] === 'nr') {
                commandParameterDelimiter = 'utwór nr';
            }
            props.onToggleTrackPlaybackVoiceCommand(targetPlaybackState, getCommandParameter(commandSplitBySpace.slice(1).join(' '), commandParameterDelimiter));
        }
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