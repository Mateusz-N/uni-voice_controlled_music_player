import { useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';

import { romanToDecimal, toVoiceCommand } from 'common/auxiliaryFunctions';

import HomePage from 'pages/Home';
import PlaylistPage from 'pages/Playlist';
import AlbumPage from 'pages/Album';
import ArtistPage from 'pages/Artist';
import SettingsPage from "pages/Settings";
import SearchPage from "pages/Search";

import EmbeddedPlayer from 'components/EmbeddedPlayer/EmbeddedPlayer';

import 'App.css';

const App = () => {
  // #region Zmienne stanu (useState Hooks)
  const [defaultPlaylistPlaybackState, setDefaultPlaylistPlaybackState] = useState(null);
  const [defaultTrackInPlaylistAction, setDefaultTrackInPlaylistAction] = useState({target: null, action: null, trackID: null});
  const [defaultTrackDetailsDisplay, setDefaultTrackDetailsDisplay] = useState({trackID: null});
  const [defaultItemDetailsDisplay, setDefaultItemDetailsDisplay] = useState(false);
  const [defaultLyricsDisplay, setDefaultLyricsDisplay] = useState(false);
  const [defaultSelectAction, setDefaultSelectAction] = useState({action: null, itemIdentifier: null});
  const [defaultFormAction, setDefaultFormAction] = useState(null);
  const [defaultSearchQuery, setDefaultSearchQuery] = useState(null);
  const [defaultPlayingTrack, setDefaultPlayingTrack] = useState({
    id: null,
    title: null,
    artistName: null,
    albumName: null,
    duration: null,
    paused: null,
    ended: null,
    playlistID: null
  });
  const [playingTrack, setPlayingTrack] = useState({
    id: null,
    title: null,
    artistName: null,
    albumName: null,
    duration: null,
    paused: null,
    ended: null,
    playlistID: null
  });
  const [playbackRequest, setPlaybackRequest] = useState({
    id: null,
    title: null,
    artistName: null,
    albumName: null,
    duration: null,
    paused: null,
    ended: null,
    playlistID: null
  });
  // #endregion

  // #region Zmienne nawigacji (useNavigate Hooks)
  const navigate = useNavigate();
  // #endregion

  // #region Obsługa zdarzeń (Event Handlers)
  const handlePlaylistPlaybackToggle = (track) => {
    setDefaultPlaylistPlaybackState(null);
    handlePlaybackToggle(track);
  }
  const handleRequestDefaultPlaylistPlaybackState = (targetState) => {
    setDefaultPlaylistPlaybackState(targetState);
  }
  const handleRequestDefaultTrackPlaybackState = (playlist, targetState, trackIdentifier = '') => {
    let matchedTrack = handleFindItemByProperty(playlist.tracks, 'id', playingTrack.id);
    if(targetState === 'play' && trackIdentifier.length > 0) {
      matchedTrack = findMatchingTrackByIdentifier(playlist.tracks, trackIdentifier);
    }
    if(!matchedTrack ||
      (targetState === 'play' && playingTrack.id === matchedTrack.id && playingTrack.paused === false) ||
      (targetState === 'pause' && playingTrack.paused === true)) {
        return;
    }
    setDefaultPlayingTrack({
      id: matchedTrack.id,
      title: matchedTrack.title,
      artists: matchedTrack.artists,
      album: playlist.type === 'playlist' ? matchedTrack.album.name : playlist.name,
      duration: matchedTrack.duration_ms,
      paused: (targetState === 'pause'),
      ended: false,
      playlistID: playlist.id
    });
  }
  const handleRequestDefaultSelectAction = (action, itemIdentifier) => {
    setDefaultSelectAction({action: action, itemIdentifier: toVoiceCommand(romanToDecimal(itemIdentifier))});
  }
  const handleRequestDefaultTrackDetailsDisplay = (playlist, trackIdentifier) => {
    const matchedTrack = findMatchingTrackByIdentifier(playlist.tracks, trackIdentifier);
    if(!matchedTrack) {
      return;
    }
    setDefaultTrackDetailsDisplay({trackID: matchedTrack.id});
  }
  const handleRequestDefaultItemDetailsDisplay = () => {
    setDefaultItemDetailsDisplay(true);
  }
  const handleSelectAction = () => {
    console.log('resetting select')
    setDefaultSelectAction({action: null, itemIdentifier: null});
  }
  const handleItemDetailsModalClose = () => {
    setDefaultItemDetailsDisplay(false);
    setDefaultFormAction(null);
  }
  const handleRequestDefaultTrackInPlaylistAction = (playlist, target, action, trackIdentifier) => {
    const matchedTrack = findMatchingTrackByIdentifier(playlist.tracks, trackIdentifier);
    if(!matchedTrack) {
      return;
    }
    setDefaultTrackInPlaylistAction({target: target, action: action, trackID: matchedTrack.id});
  }
  const handleTrackInPlaylistAction = () => {
    setDefaultTrackInPlaylistAction({target: null, action: null, trackID: null});
    setDefaultFormAction(null);
  }
  const handleTrackDetailsModalClose = () => {
    setDefaultTrackDetailsDisplay({id: null});
    setDefaultFormAction(null);
  }
  const handleRequestDefaultLyricsDisplay = () => {
    if(playingTrack.id == null) {
      return;
    }
    setDefaultLyricsDisplay(true);
  }
  const handleLyricsModalClose = () => {
    setDefaultLyricsDisplay(false);
    setDefaultFormAction(null);
  }
  const handleRequestDefaultFormAction = (action) => {
    if(['submit', 'cancel', null].includes(action)) {
      setDefaultFormAction(action);
    }
  }
  const handleRequestDefaultSearchQuery = (query) => {
    setDefaultSearchQuery(query);
  }
  const handleFindItemByProperty = (items, propertyName, propertyValue, asVoiceCommand = false) => {
    if(asVoiceCommand) {
      propertyValue = toVoiceCommand(propertyValue);
    }
    return items.find(item => {
      let valueToMatch = item[propertyName];
      if(asVoiceCommand) {
        valueToMatch = toVoiceCommand(valueToMatch);
      }
      return valueToMatch === propertyValue;
    });
  }
  const handleFindItemByName = (items, itemName) => {
    return handleFindItemByProperty(items, 'name', itemName, true);
  }
  const handleShowItemByName = (itemType, items, itemName) => {
    const matchedItem = handleFindItemByName(items, itemName);
    if(!matchedItem) {
      return;
    }
    navigate(`/${itemType}/${matchedItem.id}`);
  }
  const handleEmbedPlaybackToggle = (paused, embeddedPlayer_playingTrack) => { // Faktyczna zmiana stanu odtwarzania wewnątrz osadzonego odtwarzacza
    if(paused.ended) {
      setPlayingTrack({...embeddedPlayer_playingTrack, paused: false, ended: true});
      return;
    }
    if(!paused.state) {
      setPlayingTrack({...embeddedPlayer_playingTrack, paused: false, ended: false});
      return;
    }
    if(!playingTrack.ended) {
      setPlayingTrack({...embeddedPlayer_playingTrack, paused: true, ended: false});
    }
  }
  const handlePlaybackToggle = (track) => { // Żądanie odtworzenia/pauzy z poziomu komponentu TrackList
    setDefaultPlayingTrack({
      id: null,
      title: null,
      artistName: null,
      albumName: null,
      duration: null,
      paused: null,
      ended: null,
      playlistID: null
    });
    setPlayingTrack({...playingTrack, ended: false});
    setPlaybackRequest({
      id: track.id,
      title: track.title,
      artistName: track.artists[0].name,
      albumName: track.album.name,
      duration: track.duration_ms,
      paused: (playingTrack.id !== track.id) ? false : !playingTrack.paused, // Autoodtwarzanie w przypadku wybrania nowego utworu
      ended: false,
      playlistID: track.playlistID
    });
  }
  // #endregion

  // #region Funkcje pomocnicze
  const findMatchingTrackByIdentifier = (tracks, identifier) => {
    let matchedTrack = tracks[parseInt(romanToDecimal(identifier)) - 1];
    if(isNaN(identifier)) {
      matchedTrack = handleFindItemByProperty(tracks, 'title', identifier, true);
    }
    return matchedTrack;
  }
  // #endregion
  
  // #region Struktura komponentu (JSX)
  const universalProps = {
    defaultSelectAction: defaultSelectAction,
    defaultFormAction: defaultFormAction,
    defaultSearchQuery: defaultSearchQuery,
    defaultTrackDetailsDisplay: defaultTrackDetailsDisplay,
    defaultItemDetailsDisplay: defaultItemDetailsDisplay,
    playingTrack: playingTrack,
    onRequestDefaultFormAction: handleRequestDefaultFormAction,
    onRequestDefaultSearchQuery: handleRequestDefaultSearchQuery,
    onRequestShowItemByName: handleShowItemByName,
    onRequestFindItemByName: handleFindItemByName,
    onRequestShowTrackDetails: handleRequestDefaultTrackDetailsDisplay,
    onRequestHideTrackDetails: handleTrackDetailsModalClose,
    onRequestShowItemDetails: handleRequestDefaultItemDetailsDisplay,
    onRequestHideItemDetails: handleItemDetailsModalClose,
    onRequestDefaultSelectAction: handleRequestDefaultSelectAction,
    onRequestTrackInPlaylistAction: handleRequestDefaultTrackInPlaylistAction,
    onRequestShowLyrics: handleRequestDefaultLyricsDisplay,
    onPlaybackToggle: handlePlaybackToggle,
  }
  const playlistProps = {
    defaultPlayingTrack: defaultPlayingTrack,
    defaultPlaybackState: defaultPlaylistPlaybackState,
    defaultTrackInPlaylistAction: defaultTrackInPlaylistAction,
    onRequestDefaultPlaylistPlaybackState: handleRequestDefaultPlaylistPlaybackState,
    onRequestDefaultTrackPlaybackState: handleRequestDefaultTrackPlaybackState,
    onPlaylistPlaybackToggle: handlePlaylistPlaybackToggle,
    onTrackInPlaylistAction: handleTrackInPlaylistAction,
    onSelectAction: handleSelectAction
  }
  return (
    <>
      <EmbeddedPlayer
        playbackRequest = {playbackRequest}
        defaultFormAction = {defaultFormAction}
        defaultLyricsDisplay = {defaultLyricsDisplay}
        onPlaybackToggle = {handleEmbedPlaybackToggle}
        onLyricsModalClose = {handleLyricsModalClose}
      />
      <Routes>
        <Route path = '/' element = {<HomePage {...universalProps} />} />
        <Route path = 'playlist/:id' element = {<PlaylistPage {...universalProps} {...playlistProps} />} />
        <Route path = 'album/:id' element = {<AlbumPage {...universalProps} {...playlistProps} />} />
        <Route path = 'artist/:id' element = {<ArtistPage {...universalProps} />} />
        <Route path = 'settings' element = {<SettingsPage {...universalProps} />} />
        <Route path = 'search' element = {<SearchPage {...universalProps} />} />
      </Routes>
    </> 
  );
  // #endregion
}

export default App;