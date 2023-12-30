import { Fragment, useState } from 'react';

import btn_play from 'resources/btn_play.svg';
import btn_pause from 'resources/btn_pause.svg';
import btn_kebab from 'resources/btn_kebab.svg';

import OverviewPanelDetails from 'components/OverviewPanel/OverviewPanelDetails';
import ContextMenu from 'components/ContextMenu';

import Styles from 'components/OverviewPanel/OverviewPanel.module.scss';
import OverviewPanelDetail from './OverviewPanelDetail';

const OverviewPanel = (props) => {
    const itemData = props.data;
    
    // #region Zmienne stanu (useState Hooks)
    const [playlistPaused, setPlaylistPaused] = useState(true);
    const [itemContextMenuExpanded, setItemContextMenuExpanded] = useState(false);
    // #endregion

    // #region Obsługa zdarzeń (Event Handlers)
    const handleTogglePlaylistPlayback = () => {
        setPlaylistPaused(prevState => !prevState);
    }
    const handleToggleItemContextMenu = () => {
        setItemContextMenuExpanded(prevState => !prevState);
    }
    document.body.addEventListener('click', (event) => {
        if(itemContextMenuExpanded && event.target !== document.getElementById(Styles.itemFigure_btnKebab)) {
            setItemContextMenuExpanded(false);
        }
    });
    // #endregion
    
    // #region Przypisanie dynamicznych elementów komponentu
    let kebabMenu = null;
    if(props.for === 'playlist') {
        kebabMenu =
            <Fragment>
                <img src = {btn_kebab} alt = 'Menu' id = {Styles.itemFigure_btnKebab} onClick = {handleToggleItemContextMenu} />
                <ContextMenu expanded = {itemContextMenuExpanded} context = 'itemFigure' styles = {Styles}>
                    <li id = {Styles.itemFigure_contextMenu_addTracks}>Add tracks</li>
                    <li id = {Styles.itemFigure_contextMenu_deletePlaylist} dangerous = 'true'>Delete playlist</li>
                </ContextMenu>
            </Fragment>
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