import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import btn_play from 'resources/btn_play.svg';
import btn_pause from 'resources/btn_pause.svg';

import OverviewPanelDetails from 'components/OverviewPanel/OverviewPanelDetails';
import OverviewPanelDetail from 'components/OverviewPanel/OverviewPanelDetail';
import PlaylistKebabMenu from 'components/PlaylistKebabMenu';

import Styles from 'components/OverviewPanel/OverviewPanel.module.scss';
const OverviewPanel = (props) => {
    const itemData = props.data;
    
    // #region Zmienne stanu (useState Hooks)
    const [playlistPaused, setPlaylistPaused] = useState(true);
    // #endregion

    const navigate = useNavigate();

    // #region Obsługa zdarzeń (Event Handlers)
    const handleTogglePlaylistPlayback = () => {
        setPlaylistPaused(prevState => !prevState);
    }
    const handlePlaylistDelete = () => {
        navigate('/');
    }
    const handleDetailChange = (detailName, detailValue) => {
    /*  UWAGA: punktu końcowy 'Get Playlist' będzie przez pewien czas zwracać nieaktualne dane.
        Jest to prawdopodobnie defekt w owym punkcie końcowym.
        Ponadto, właściwość 'public' zdaje się w ogóle nie być aktualizowana przez Spotify... */
        detailName = detailName.toLowerCase();
        if(detailName === 'public') {
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
        fetch(`${process.env.REACT_APP_SERVER_URL}/spotify/playlist/${itemData.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                detailName: detailName,
                detailValue: detailValue
            }),
            credentials: 'include'
        })
            .then((response) => {
                if(response.ok) {
                    return response.json();
                }
                if(response.status === 401) {
                    throw new Error('Invalid access token!');
                }
                if(response.status === 422) {
                    throw new Error('Request could not be processed. Make sure you are not sending null or undefined data!');
                }
            })
            .then((data) => {
                console.info(data.message);
            })
            .catch(console.error);
    }
    // #endregion
    
    // #region Przypisanie dynamicznych elementów komponentu
    let kebabMenu = null;
    if(props.for === 'playlist') {
        kebabMenu =
            <PlaylistKebabMenu playlistID = {itemData.id} context = 'itemFigure' styles = {Styles} onDeletePlaylist = {handlePlaylistDelete} />
    }
    // #endregion

    // #region Struktura komponentu (JSX)
    return(
        <aside id = {Styles.overviewPanel}>
            <main id = {Styles.overviewPanel_mainSection}>
                <figure id = {Styles.itemFigure}>
                    <main id = {Styles.itemFigure_thumbnail} onClick = {handleTogglePlaylistPlayback}>
                        <img src = {itemData.thumbnailSrc} alt = {itemData.name} id = {Styles.itemFigure_thumbnailImage} />
                        <img
                            src = {playlistPaused ? btn_play : btn_pause}
                            alt = {playlistPaused ? 'Play' : 'Pause'}
                            id = {playlistPaused ? Styles.playlist_btnPlay : Styles.playlist_btnPause}
                            className = {Styles.playlist_btnTogglePlayback}
                        />
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
    );
    // #endregion
}

export default OverviewPanel;