import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import { requestGetSynchronousLyrics } from 'common/serverRequests';

import btn_lyrics from 'resources/btn_lyrics.svg';

import LyricsModal from 'components/EmbeddedPlayer/LyricsModal';

import Styles from 'components/EmbeddedPlayer/EmbeddedPlayer.module.scss';

const EmbeddedPlayer = (props) => {
    // #region Zmienne globalne
    const playbackRequest = props.playbackRequest;
    const defaultFormAction = props.defaultFormAction;
    const defaultLyricsDisplay = props.defaultLyricsDisplay;
    // #endregion

    // #region Zmienne stanu (useState Hooks)
    const [embeddedPlayer_playingTrack, setEmbeddedPlayer_playingTrack] = useState({
        id: null,
        title: null,
        artistName: null,
        albumName: null,
        duration: null,
        paused: null,
        ended: null,
        playlistID: null
    });
    const [embeddedPlayerPaused, setEmbeddedPlayerPaused] = useState({state: null, ended: false});
    const [modal_lyrics_open, setModal_lyrics_open] = useState(false);
    const [currentTimestamp_ms, setCurrentTimestamp_ms] = useState(null);
    const [lyrics, setLyrics] = useState(null);
    // #endregion

    // #region Zmienne referencji (useRef Hooks)
    const ref_embeddedPlayer = useRef(null);
    const ref_IFrameAPI = useRef(null);
    const ref_EmbedController = useRef(null);
    const ref_playingTrack = useRef(null);
    // #endregion

    // #region Obsługa zdarzeń (Event Handlers)
    const handleEmbedControllerReady = () => {
        try {
            ref_EmbedController.current.play();
        }
        catch(error) {
            console.error(error);
        }
        setEmbeddedPlayer_playingTrack(ref_playingTrack.current);
        getSynchronousLyrics();
    }
    const handleEmbedControllerPlaybackUpdate = (controllerState) => {
        const trackEnded = controllerState.data.position === controllerState.data.duration && !controllerState.data.isPaused;
        setEmbeddedPlayerPaused({state: controllerState.data.isPaused, ended: trackEnded});
        setCurrentTimestamp_ms(controllerState.data.position);
    }
    const handleClickLyricsBtn = () => {
        setModal_lyrics_open(true);
    }
    const handleModalClose_lyrics = () => {
        setModal_lyrics_open(false);
        props.onLyricsModalClose();
    }
    // #endregion

    // #region Funkcje pomocnicze
    const getSynchronousLyrics = () => {
        requestGetSynchronousLyrics(
            ref_playingTrack.current.title,
            ref_playingTrack.current.artistName,
            ref_playingTrack.current.albumName,
            Math.floor(ref_playingTrack.current.duration / 1000),
            (lyrics) => {
                setLyrics(lyrics);
            }
        );
    }
    // #endregion

    // #region Wywołania zwrotne (useEffect Hooks)
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://open.spotify.com/embed/iframe-api/v1';
        script.async = true;
        document.body.appendChild(script);
        window.onSpotifyIframeApiReady = (IFrameAPI) => {
            ref_IFrameAPI.current = IFrameAPI;
        };
        return () => {
            document.body.removeChild(script);
        };
    },[]);
    useEffect(() => {
        if(playbackRequest.id == null) {
            return;
        }
        ref_playingTrack.current = playbackRequest;
        if(ref_IFrameAPI.current) { // API załadowane
            const element = ref_embeddedPlayer.current;
            const options = {
                uri: `spotify:track:${playbackRequest.id}`,
                width: '100%',
                height: '100%'
            };
            const callback = (EmbedController) => {
                ref_EmbedController.current = EmbedController;
                EmbedController.addListener('ready', handleEmbedControllerReady);
                EmbedController.addListener('playback_update', handleEmbedControllerPlaybackUpdate);
            };
            try {
                // Odtwarzacz nie załadowany
                if(!ref_EmbedController.current) {
                    ref_IFrameAPI.current.createController(element, options, callback);
                    return;
                }
                // Pauza
                if(playbackRequest.paused && playbackRequest.playlistID === embeddedPlayer_playingTrack.playlistID) {
                    if(!embeddedPlayerPaused.state) {
                        ref_EmbedController.current.pause();
                    }
                    return;
                }
                if(!playbackRequest.paused) {
                    // Wznowienie aktualnego utworu
                    if(playbackRequest.id === embeddedPlayer_playingTrack.id && playbackRequest.playlistID === embeddedPlayer_playingTrack.playlistID) { 
                        ref_EmbedController.current.resume();
                        return;
                    }
                    /*  Wywoła zdarzenie 'ready',
                        którego funkcja nasłuchująca
                        zajmie się rozpoczęciem odtwarzania */
                        props.onPlaybackToggle({state: true, ended: false}, embeddedPlayer_playingTrack); // Zasygnalizuj pauzę wskutek zmiany utworu
                        ref_EmbedController.current.loadUri(`spotify:track:${playbackRequest.id}`); // Odtworzenie nowego utworu (!request.paused && request.id !== playingTrack.id)
                }
            }
            catch(error) {
                console.error(error);
            }
        }
        return () => {
            if(ref_EmbedController.current) {
                ref_EmbedController.current.removeListener('ready', handleEmbedControllerReady);
                ref_EmbedController.current.removeListener('playback_update', handleEmbedControllerPlaybackUpdate);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[playbackRequest]);
    useEffect(() => {
        if(embeddedPlayerPaused.state == null) {
            return;
        }
        props.onPlaybackToggle(embeddedPlayerPaused, embeddedPlayer_playingTrack);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[embeddedPlayerPaused])
    useEffect(() => {
        if(!defaultLyricsDisplay) {
            return;
        }
        setModal_lyrics_open(true);
    },[defaultLyricsDisplay]);
    // #endregion

    // #region Przypisanie dynamicznych elementów komponentu
    let lyricsModal = null;
    if(modal_lyrics_open) {
        lyricsModal =
            createPortal(<LyricsModal
                lyrics = {lyrics}
                currentTimestamp = {currentTimestamp_ms}
                defaultAction = {defaultFormAction}
                onClose = {handleModalClose_lyrics}
            />, document.body);
    }
    let lyricsBtn = null;
    if(ref_EmbedController.current && lyrics && (lyrics.plainLyrics || lyrics.syncedLyrics)) {
        lyricsBtn = <img src = {btn_lyrics} alt = 'Show lyrics' id = {Styles.btnLyrics} title = 'Show lyrics' onClick = {handleClickLyricsBtn} />;
    }
    // #endregion

    // #region Struktura komponentu (JSX)
    return(
        <main id = {Styles.embeddedPlayerContainer}>
            <div id = {Styles.embeddedPlayer} ref = {ref_embeddedPlayer} />
            {lyricsModal}
            {lyricsBtn}
        </main>
    );
    // #endregion
}

export default EmbeddedPlayer;