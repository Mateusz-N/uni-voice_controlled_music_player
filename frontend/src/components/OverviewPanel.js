import { useState, useRef } from 'react';

import btn_play from 'resources/btn_play.svg';
import btn_pause from 'resources/btn_pause.svg';
import btn_edit from 'resources/btn_edit.svg';
import btn_kebab from 'resources/btn_kebab.svg';

import OverviewPanelDetails from 'components/OverviewPanelDetails';

import Styles from 'components/OverviewPanel.module.scss';
import ContextMenu from './ContextMenu';

const OverviewPanel = (props) => {

    const mode = props.mode;

    // #region Zmienne stanu (useState Hooks)
    const [itemData, setItemData] = useState(props.data);
    const [playlistPaused, setPlaylistPaused] = useState(true);
    const [itemNameEditModeActive, setItemNameEditModeActive] = useState(false);
    const [itemContextMenuExpanded, setItemContextMenuExpanded] = useState(false);
    // #endregion

    const input_itemName = useRef(null);

    // #region Obsługa zdarzeń (Event Handlers)
    const handleTogglePlaylistPlayback = () => {
        setPlaylistPaused(prevState => !prevState);
    }
    const handleEnableItemNameEditMode = () => {
        setItemNameEditModeActive(true);
    }
    const handleDisableItemNameEditMode = () => {
        setItemNameEditModeActive(false);
    }
    const handleSubmitItemNameForm = (event) => {
        console.log(event)
        event.preventDefault();
        setItemData(prevState => {
            prevState.name = input_itemName.current.value;
            return prevState;
        })
        handleDisableItemNameEditMode();
    }
    const handleCancelItemNameForm = (event) => {
        event.preventDefault();
        handleDisableItemNameEditMode();
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
        <form id = {Styles.form_itemName} onSubmit = {event => handleSubmitItemNameForm(event)}>
            <input
                id = {Styles.input_itemName}
                name = 'itemName'
                defaultValue = {itemData.name}
                min = '1'
                max = '127'
                ref = {input_itemName}
            />
            <section className = 'formControlSection'>
                <button id = {Styles.btnCancel_itemName} className = 'btnSecondary' onClick = {event => handleCancelItemNameForm(event)} type = 'button'>Cancel</button>
                <button id = {Styles.btnSubmit_itemName} className = 'btnPrimary' onClick = {event => handleSubmitItemNameForm(event)}>Apply</button>
            </section>
        </form>
    let btn_editItemName = null;
    if(!itemNameEditModeActive) {
        btn_editItemName = 
            <img
                src = {btn_edit}
                alt = 'Edit'
                className = {Styles.playlist_btnEditItemName}
                onClick = {handleEnableItemNameEditMode}
            />
    }
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
                        {mode === 'modify' ? btn_editItemName : btn_togglePlayback}
                        {itemNameEditModeActive ? form_itemName : header_itemName}
                    </figcaption>
                </figure>
                <hr/>
                <OverviewPanelDetails items = {itemData.detailsToDisplay} for = {props.for} />
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