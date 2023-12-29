import { useState } from 'react';

import { setPropertyByString } from 'common/auxiliaryFunctions';

import btn_play from 'resources/btn_play.svg';
import btn_pause from 'resources/btn_pause.svg';
import btn_kebab from 'resources/btn_kebab.svg';

import OverviewPanelDetails from 'components/OverviewPanel/OverviewPanelDetails';
import ContextMenu from 'components/ContextMenu';
import DetailEditForm from 'components/DetailEditForm';
import EditButton from 'components/EditButton';

import Styles from 'components/OverviewPanel/OverviewPanel.module.scss';

const OverviewPanel = (props) => {

    const mode = props.mode;

    // #region Zmienne stanu (useState Hooks)
    const [itemData, setItemData] = useState(props.data);
    const [playlistPaused, setPlaylistPaused] = useState(true);
    const [itemNameEditModeActive, setItemNameEditModeActive] = useState(false);
    const [itemContextMenuExpanded, setItemContextMenuExpanded] = useState(false);
    // #endregion

    // #region Obsługa zdarzeń (Event Handlers)
    const handleTogglePlaylistPlayback = () => {
        setPlaylistPaused(prevState => !prevState);
    }
    const handleEnableDetailEditMode = () => {
        setItemNameEditModeActive(true);
    }
    const handleDisableDetailEditMode = () => {
        setItemNameEditModeActive(false);
    }
    const handleSubmitEditForm = (event, targetDataPropertyReference, detailValue) => {
        event.preventDefault();
        setItemData(prevState => setPropertyByString(prevState, targetDataPropertyReference, detailValue));
        handleDisableDetailEditMode();
    }
    const handleCancelEditForm = (event) => {
        event.preventDefault();
        handleDisableDetailEditMode();
    }
    const handleToggleItemContextMenu = () => {
        setItemContextMenuExpanded(prevState => !prevState);
    }
    document.body.addEventListener('click', (event) => {
        if(itemContextMenuExpanded && event.target !== document.getElementById(Styles.itemFigure_btnKebab)) {
            setItemContextMenuExpanded(false);
        }
    })
    // #endregion
    
    // #region Przypisanie dynamicznych elementów komponentu
    const btn_togglePlayback = 
        <img
            src = {playlistPaused ? btn_play : btn_pause}
            alt = {playlistPaused ? 'Play' : 'Pause'}
            id = {playlistPaused ? Styles.playlist_btnPlay : Styles.playlist_btnPause}
            className = {Styles.playlist_btnTogglePlayback}
            onClick = {handleTogglePlaylistPlayback}
        />
    const header_itemName =
        <h3 id = {Styles.itemName}>
            {itemData.name}
        </h3>
    const form_itemName =
        <DetailEditForm
            detail = 'itemName'
            defaultValue = {itemData.name}
            onSubmit = {(event, header_itemName_value) => handleSubmitEditForm(event, 'name', header_itemName_value)}
            onCancel = {(event) => handleCancelEditForm(event)}
            styles = {Styles}
            inputOptions = {{}}
        />
    // #endregion

    // #region Struktura komponentu (JSX)
    return(
        <aside id = {Styles.overviewPanel}>
            <main id = {Styles.overviewPanel_mainSection}>
                <figure id = {Styles.itemFigure}>
                    <img src = {itemData.thumbnailSrc} alt = {itemData.name} id = {Styles.itemFigure_thumbnail} />
                    <img src = {btn_kebab} alt = 'Menu' id = {Styles.itemFigure_btnKebab} onClick = {handleToggleItemContextMenu} />
                    <ContextMenu expanded = {itemContextMenuExpanded} context = 'itemFigure' styles = {Styles}>
                        <li id = {Styles.itemFigure_contextMenu_addTracks}>Add tracks</li>
                        <li id = {Styles.itemFigure_contextMenu_deletePlaylist} dangerous = 'true'>Delete playlist</li>
                    </ContextMenu>
                    <figcaption id = {Styles.itemFigcaption}>
                        {mode === 'modify' ? itemNameEditModeActive ? null : <EditButton onEnableEditMode = {handleEnableDetailEditMode} styles = {Styles} /> : btn_togglePlayback}
                        {itemNameEditModeActive ? form_itemName : header_itemName}
                    </figcaption>
                </figure>
                <hr/>
                <OverviewPanelDetails
                    items = {itemData.detailsToDisplay}
                    for = {props.for}
                    onSubmitEditForm = {handleSubmitEditForm}
                    onCancelEditForm = {handleCancelEditForm}
                />
            </main>
            <hr/>
            <section id = {Styles.itemDescription}>
                <p>{itemData.description}</p>
            </section>
        </aside>
    );
    // #endregion
}

export default OverviewPanel;