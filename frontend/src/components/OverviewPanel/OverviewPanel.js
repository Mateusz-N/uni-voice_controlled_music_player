import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';

import { requestUpdatePlaylist } from 'common/serverRequests';

import btn_play from 'resources/btn_play.svg';
import btn_pause from 'resources/btn_pause.svg';

import OverviewPanelDetails from 'components/OverviewPanel/OverviewPanelDetails';
import OverviewPanelDetail from 'components/OverviewPanel/OverviewPanelDetail';
import PlaylistKebabMenu from 'components/generic/instances/PlaylistKebabMenu';
import ItemDetailsKebabMenu from 'components/OverviewPanel/ItemDetailsKebabMenu';
import Toast from 'components/generic/Toast';

import Styles from 'components/OverviewPanel/OverviewPanel.module.scss';
const OverviewPanel = (props) => {
    // #region Zmienne globalne
    const itemData = props.data;
    const playingTrack = props.playingTrack;
    const playlistPlaying = (!playingTrack.paused && playingTrack.paused != null && playingTrack.playlistID === itemData.id);
    const deletionRequested = props.requestDelete;
    const setProperty = props.setProperty;
    const defaultPlaybackState = props.defaultPlaybackState;
    const defaultFormAction = props.defaultFormAction;
    const defaultItemDetailsDisplay = props.defaultItemDetailsDisplay;
    // #endregion
    
    // #region Zmienne stanu (useState Hooks)
    // const [presetProperties, setPresetProperties] = useState([]);
    const [notification, setNotification] = useState({});
    // #endregion

    const ref_itemFigure_thumbnail = useRef(null);

    // #region Zmienne nawigacji (useNavigate Hooks)
    const navigate = useNavigate();
    // #endregion

    // #region Obsługa zdarzeń (Event Handlers)
    const handleTogglePlaylistPlayback = () => {
        if(itemData.tracks.length === 0) {
            return;
        }
        let trackIndex = itemData.tracks.length - 1;
        let track = itemData.tracks[0]; // Odtwarzaj od pierwszego, jeśli odtwarzana jest obecnie inna lista lub żadna
        if(playingTrack.playlistID === itemData.id) {
            track = itemData.tracks.find(track => track.id === playingTrack.id);
        }
        if(playingTrack.ended || playingTrack.id == null) {
            do {
                trackIndex++;
                if(trackIndex >= itemData.tracks.length) {
                    trackIndex = 0;
                }
                track = itemData.tracks[trackIndex];
            }
            while(track.local);
        }
        if(props.for === 'album') {
            track.album = {name: itemData.name}
        }
        track.playlistID = itemData.id;
        props.onPlaybackToggle(track);
    }
    const handlePlaylistDelete = () => {
        navigate('/');
    }
    const handleDetailChange = (detailName, detailValue) => {
    /*  UWAGA: punktu końcowy 'Get Playlist' będzie przez pewien czas zwracać nieaktualne dane.
        Jest to prawdopodobnie defekt w owym punkcie końcowym.
        Ponadto, właściwość 'public' zdaje się w ogóle nie być aktualizowana przez Spotify... */
        props.onDetailChange();
        detailName = detailName.toLowerCase();
        if(['public', 'collaborative'].includes(detailName)) {
            if(detailValue === 'yes') {
                detailValue = true;
            }
            else if(detailValue === 'no') {
                detailValue = false;
            }
        }
        else if(detailName === 'name') {
            if(detailValue.length === 0) {
                detailValue = 'Unknown playlist';
            }
        }
        else if(detailName === 'description') {
            if(detailValue.length === 0) {
                detailValue = 'No description.';
            }
        }
        requestUpdatePlaylist(itemData.id, {
            name: detailName,
            value: detailValue
        }, (data) => {
            const notificationMessage = data.message.type === 'success' ? data.message.message + '\nNote: It may take a while for the changes to apply.' : data.message.message;
            setNotification({message: notificationMessage, type: data.message.type});
        });
    }
    // #endregion

    // #region Wywołania zwrotne (useEffect Hooks)
    useEffect(() => {
        if(!defaultPlaybackState || (playlistPlaying && defaultPlaybackState === 'play') || (!playlistPlaying && defaultPlaybackState === 'pause')) {
            return;
        }
        ref_itemFigure_thumbnail.current.click();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[defaultPlaybackState]);
    useEffect(() => {
        if(setProperty == null) {
            return;
        }
        handleDetailChange(setProperty.name, setProperty.value);
        itemData.detailsToDisplay[itemData.detailsToDisplay.indexOf(itemData.detailsToDisplay.find(detail => (detail.name === setProperty.name)))].content = setProperty.value;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[setProperty]);
    // #endregion
    
    // #region Przypisanie dynamicznych elementów komponentu
    let btnTogglePlayback = null;
    if(['playlist', 'album'].includes(props.for)) {
        btnTogglePlayback =
            <img
                src = {playlistPlaying ? btn_pause : btn_play}
                alt = {playlistPlaying ? 'Pause' : 'Play'}
                id = {playlistPlaying ? Styles.playlist_btnPause : Styles.playlist_btnPlay}
                className = {Styles.playlist_btnTogglePlayback}
            />
    }
    let kebabMenu = null;
    if(props.for === 'playlist') {
        kebabMenu =
            <PlaylistKebabMenu
                playlist = {itemData}
                requestDelete = {deletionRequested}
                defaultFormAction = {defaultFormAction}
                context = 'itemFigure'
                styles = {Styles}
                onDeletePlaylist = {handlePlaylistDelete}
                onCancelDeletePlaylist = {props.onCancelDeletePlaylist}
            />
    }
    else if(['artist', 'album'].includes(props.for)) {
        kebabMenu =
            <ItemDetailsKebabMenu
                item = {itemData}
                itemType = {props.for}
                defaultDisplay = {defaultItemDetailsDisplay}
                defaultFormAction = {defaultFormAction}
                context = 'itemFigure'
                styles = {Styles}
                onItemDetailsModalClose = {props.onItemDetailsModalClose}
            />
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
            <aside id = {Styles.overviewPanel}>
                <main id = {Styles.overviewPanel_mainSection}>
                    <figure id = {Styles.itemFigure}>
                        <main
                            id = {Styles.itemFigure_thumbnail}
                            onClick = {['playlist', 'album'].includes() ? handleTogglePlaylistPlayback : null}
                            ref = {ref_itemFigure_thumbnail}
                        >
                            <img src = {itemData.thumbnailSrc} alt = {itemData.name} id = {Styles.itemFigure_thumbnailImage} />
                            {btnTogglePlayback}
                        </main>
                        {kebabMenu}
                        <figcaption id = {Styles.itemFigcaption}>
                            <OverviewPanelDetail
                                key = {itemData.name}
                                item = {itemData.detailsToDisplay.find(detail => detail.name === 'Name')}
                                customItemContentNode = {{tagName: 'h3', attributes: {id: Styles.itemName}}}
                                customNullValueMessage = {{message: 'Unknown ' + props.for, hideItemName: true}}
                                standalone = 'true'
                                hideItemName = 'always'
                                styles = {Styles}
                                for = {props.for}
                                onDetailChange = {(detailName, detailValue) => handleDetailChange(detailName, detailValue)}
                            />
                        </figcaption>
                    </figure>
                    <hr/>
                    <OverviewPanelDetails
                        items = {itemData.detailsToDisplay.filter(detail => !detail.showSeparately)}
                        for = {props.for}
                        onDetailChange = {(detailName, detailValue) => handleDetailChange(detailName, detailValue)}
                    />
                </main>
                <hr/>
                <section id = {Styles.itemDescriptionSection}>
                    <OverviewPanelDetail
                        key = {itemData.description}
                        item = {itemData.detailsToDisplay.find(detail => detail.name === 'Description')}
                        customItemContentNode = {{tagName: 'p', attributes: {id: Styles.itemDescription}}}
                        customNullValueMessage = {{message: 'No description.', hideItemName: true, attributes: {style: {fontStyle: 'italic'}}}}
                        standalone = 'true'
                        hideItemName = 'always'
                        styles = {Styles}
                        for = {props.for}
                        onDetailChange = {(detailName, detailValue) => handleDetailChange(detailName, detailValue)}
                    />
                </section>
            </aside>
        </>
    );
    // #endregion
}

export default OverviewPanel;