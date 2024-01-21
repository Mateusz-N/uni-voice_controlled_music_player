import { useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';

import { toVoiceCommand } from 'common/auxiliaryFunctions';

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
  const [defaultFormAction, setDefaultFormAction] = useState(null);
  const [defaultSearchQuery, setDefaultSearchQuery] = useState(null);
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
    console.log(track)
    setDefaultPlaylistPlaybackState(null);
    handlePlaybackToggle(track);
  }
  const handleRequestDefaultPlaylistPlaybackState = (targetState) => {
    setDefaultPlaylistPlaybackState(targetState);
  }
  const handleRequestDefaultFormAction = (action) => {
    if(['submit', 'cancel', null].includes(action)) {
      setDefaultFormAction(action);
    }
  }
  const handleRequestDefaultSearchQuery = (query) => {
    setDefaultSearchQuery(query);
  }
  const handleFindItemByName = (items, itemName) => {
    return items.find(item => toVoiceCommand(item.name) === toVoiceCommand(itemName));
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
  
  // #region Struktura komponentu (JSX)
  const universalProps = {
    defaultFormAction: defaultFormAction,
    defaultSearchQuery: defaultSearchQuery,
    playingTrack: playingTrack,
    onRequestDefaultFormAction: handleRequestDefaultFormAction,
    onRequestDefaultSearchQuery: handleRequestDefaultSearchQuery,
    onRequestShowItemByName: handleShowItemByName,
    onRequestFindItemByName: handleFindItemByName,
    onPlaybackToggle: handlePlaybackToggle
  }
  const playlistProps = {
    defaultPlaybackState: defaultPlaylistPlaybackState,
    onRequestDefaultPlaylistPlaybackState: handleRequestDefaultPlaylistPlaybackState,
    onPlaylistPlaybackToggle: handlePlaylistPlaybackToggle
  }
  return (
    <>
      <EmbeddedPlayer playbackRequest = {playbackRequest} onPlaybackToggle = {handleEmbedPlaybackToggle} />
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