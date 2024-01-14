import { useState, useEffect, useRef } from 'react';

import Styles from 'components/EmbeddedPlayer.module.scss';

const EmbeddedPlayer = (props) => {
    // #region Zmienne globalne
    const playingTrackID = props.playingTrackID;
    // #endregion

    // #region Zmienne stanu (useState Hooks)
    const [embeddedPlayer_playingTrackID, setEmbeddedPlayer_playingTrackID] = useState(null);
    const [embeddedPlayerPaused, setEmbeddedPlayerPaused] = useState(true);
    // #endregion

    // #region Zmienne referencji (useRef Hooks)
    const ref_embeddedPlayer = useRef(null);
    const ref_IFrameAPI = useRef(null);
    const ref_EmbedController = useRef(null);
    const ref_playingTrackID = useRef(null);
    // #endregion

    // #region Obsługa zdarzeń (Event Handlers)
    const handleEmbedControllerReady = () => {
        ref_EmbedController.current.play();
        setEmbeddedPlayer_playingTrackID(ref_playingTrackID.current);
    }
    const handleEmbedControllerPlaybackUpdate = (controllerState) => {
        setEmbeddedPlayerPaused(controllerState.data.isPaused);
    }
    const handleEmbedControllerError = (error) => {
        console.error(error);
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
        ref_playingTrackID.current = playingTrackID;
        if(ref_IFrameAPI.current) { // API załadowane
            const element = ref_embeddedPlayer.current;
            const options = {
                uri: `spotify:track:${playingTrackID}`,
                width: '100%',
                height: '100%'
            };
            const callback = (EmbedController) => {
                ref_EmbedController.current = EmbedController;
                EmbedController.addListener('ready', handleEmbedControllerReady);
                EmbedController.addListener('playback_update', handleEmbedControllerPlaybackUpdate);
                EmbedController.addListener('error', handleEmbedControllerError);
            };
            if(!ref_EmbedController.current) { // Odtwarzacz nie załadowany
                ref_IFrameAPI.current.createController(element, options, callback);
                return;
            }
            if(!playingTrackID) { // Pauza
                ref_EmbedController.current.pause();
                return;
            }
            console.log(playingTrackID, embeddedPlayer_playingTrackID);
            if(playingTrackID === embeddedPlayer_playingTrackID) { // Wznowiono/zapauzowano aktualny utwór
                ref_EmbedController.current.resume();
                return;
            }
            ref_EmbedController.current.loadUri(`spotify:track:${playingTrackID}`); /*  Wywoła zdarzenie 'ready',
                                                                                        którego funkcja nasłuchująca
                                                                                        zajmie się rozpoczęciem odtwarzania */
        }
        return () => {
            if(ref_EmbedController.current) {
                ref_EmbedController.current.removeListener('ready', handleEmbedControllerReady);
                ref_EmbedController.current.removeListener('playback_update', handleEmbedControllerPlaybackUpdate);
                ref_EmbedController.current.removeListener('error', handleEmbedControllerError);
            }
        };
    },[playingTrackID]);
    useEffect(() => {
        props.onPlaybackToggle(embeddedPlayerPaused, embeddedPlayer_playingTrackID);
    },[embeddedPlayerPaused])
    // #endregion

    // #region Struktura komponentu (JSX)
    return(
        <main id = {Styles.embeddedPlayerContainer}>
            <div id = {Styles.embeddedPlayer} ref = {ref_embeddedPlayer} />
        </main>
    );
    // #endregion
}

export default EmbeddedPlayer;