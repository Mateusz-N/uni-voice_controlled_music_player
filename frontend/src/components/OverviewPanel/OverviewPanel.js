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
    // #endregion
    
    // #region Przypisanie dynamicznych elementów komponentu
    let kebabMenu = null;
    if(props.for === 'playlist') {
        kebabMenu =
            <PlaylistKebabMenu playlistID = {itemData.id} context = 'itemFigure' styles = {Styles} onDeletePlaylist = {navigate('/')} />
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
                        />
                    </figcaption>
                </figure>
                <hr/>
                <OverviewPanelDetails
                    items = {itemData.detailsToDisplay.filter(detail => !detail.showSeparately)}
                    for = {props.for}
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
                />
            </section>
        </aside>
    );
    // #endregion
}

export default OverviewPanel;