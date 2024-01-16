import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';

import Modal from 'components/generic/Modal';
import Toast from 'components/generic/Toast';

import Styles from 'components/EmbeddedPlayer/LyricsModal.module.scss';

const LyricsModal = (props) => {
    // #region Funkcje pomocnicze
    const getCurrentLine = (syncedLyrics, currentTimestamp) => {
        let currentLine = null;
        for(const line of syncedLyrics) {
            const match = /\[(\d+):(\d+)\.(\d+)\]/.exec(line);
            if(match) {
                const minutes = parseInt(match[1]);
                const seconds = parseFloat(match[2]);
                const centiseconds = parseFloat(match[3]);
                const lyricTimestamp_ms = ((minutes * 60 + seconds) * 100 + centiseconds) * 10;
                
                if(currentTimestamp < lyricTimestamp_ms) {
                    // Utwór jeszcze nie jest w tym momencie; wyjdź z pętli i zwróć ostatni przypisany wiersz
                    break;
                }
                currentLine = line;
            }
        }
        return syncedLyrics.indexOf(currentLine);
    }
    // #endregion

    // #region Zmienne stanu (useState Hooks)
    const [notification, setNotification] = useState({});
    // #endregion

    // #region Zmienne globalne
    const currentTimestamp = props.currentTimestamp;
    const lyrics = props.lyrics;
    const blankLineIndexes = [];
    const index = props.index;

    let lyricLines = lyrics.plainLyrics.split(/(\n)/);
    let syncedLyricLines;
    let unhighlightedLines;
    let highlightedLine
    if(lyrics.syncedLyrics) {
        syncedLyricLines = lyrics.syncedLyrics.split(/(\n)/);
        let highlightedLineIndex = getCurrentLine(syncedLyricLines, currentTimestamp);
        lyricLines.forEach((line, index) => {
            if(line === '') {
                blankLineIndexes.push(index);
            }
        });
        for(const blankLineIndex of blankLineIndexes) {
            if(blankLineIndex > highlightedLineIndex) {
                break;
            }
            highlightedLineIndex += 2; // Pomiń puste wiersze ['', '\n']
        }
        unhighlightedLines = [lyricLines.slice(0, highlightedLineIndex), highlightedLineIndex === -1 ? null : lyricLines.slice(highlightedLineIndex + 1)];
        highlightedLine = lyricLines[highlightedLineIndex];
    }
    useEffect(() => {
        if(!lyrics.syncedLyrics) {
            setNotification({message: 'Couldn\'t find synchronous lyrics. Displaying static lyrics instead.', type: 'information'});
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
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
            <Modal key = {index} title = 'Lyrics' id = {'lyrics_' + index} onClose = {props.onClose} styles = {Styles}>
                <main className = {Styles.lyricsModal_main}>
                    <p className = {Styles.lyricsAttribution}>~ Lyrics brought to you by <Link to = 'https://lrclib.net/'>Lrclib</Link> ~</p>
                    <p className = {Styles.lyrics}>
                        {lyrics.syncedLyrics ?
                            <>
                                {unhighlightedLines[0]}
                                <span className = {Styles.currentLine}>{highlightedLine}</span>
                                {unhighlightedLines[1]}
                            </>
                        : lyrics.plainLyrics}
                    </p>
                </main>
            </Modal>
        </>
    );
    // #endregion
}

export default LyricsModal;