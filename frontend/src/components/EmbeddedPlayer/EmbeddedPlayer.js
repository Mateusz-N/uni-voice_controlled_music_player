import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import { requestGetSynchronousLyrics } from 'common/serverRequests';

import btn_lyrics from 'resources/btn_lyrics.svg';

import LyricsModal from 'components/EmbeddedPlayer/LyricsModal';

import Styles from 'components/EmbeddedPlayer/EmbeddedPlayer.module.scss';

const EmbeddedPlayer = (props) => {
    // #region Zmienne globalne
    const playingTrack = props.playingTrack;
    // #endregion

    // #region Zmienne stanu (useState Hooks)
    const [embeddedPlayer_playingTrack, setEmbeddedPlayer_playingTrack] = useState({});
    const [embeddedPlayerPaused, setEmbeddedPlayerPaused] = useState({state: true, ended: false});
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
        ref_playingTrack.current = playingTrack;
        if(ref_IFrameAPI.current) { // API załadowane
            const element = ref_embeddedPlayer.current;
            const options = {
                uri: `spotify:track:${playingTrack.id}`,
                width: '100%',
                height: '100%'
            };
            const callback = (EmbedController) => {
                ref_EmbedController.current = EmbedController;
                EmbedController.addListener('ready', handleEmbedControllerReady);
                EmbedController.addListener('playback_update', handleEmbedControllerPlaybackUpdate);
            };
            try {
                if(!ref_EmbedController.current) { // Odtwarzacz nie załadowany
                    ref_IFrameAPI.current.createController(element, options, callback);
                    return;
                }
                if(!playingTrack.id) { // Pauza lub przełączenie utworu
                    if(!embeddedPlayerPaused.state) {
                        ref_EmbedController.current.pause();
                    }
                    return;
                }
                if(playingTrack.id === embeddedPlayer_playingTrack.id) { // Wznowiono/zapauzowano aktualny utwór
                    ref_EmbedController.current.resume();
                    return;
                }
                ref_EmbedController.current.loadUri(`spotify:track:${playingTrack.id}`); /*  Wywoła zdarzenie 'ready',
                                                                                            którego funkcja nasłuchująca
                                                                                            zajmie się rozpoczęciem odtwarzania */
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
    },[playingTrack.id]);
    useEffect(() => {
        props.onPlaybackToggle(embeddedPlayerPaused, embeddedPlayer_playingTrack);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[embeddedPlayerPaused])
    // #endregion

    // #region Przypisanie dynamicznych elementów komponentu
    let lyricsModal = null;
    if(modal_lyrics_open) {
        lyricsModal =
            createPortal(<LyricsModal
                lyrics = {lyrics}
                currentTimestamp = {currentTimestamp_ms}
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