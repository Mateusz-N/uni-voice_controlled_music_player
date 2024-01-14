import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';

import HomePage from 'pages/Home';
import PlaylistPage from 'pages/Playlist';
import AlbumPage from 'pages/Album';
import ArtistPage from 'pages/Artist';
import SettingsPage from "pages/Settings";
import SearchPage from "pages/Search";

import EmbeddedPlayer from 'components/EmbeddedPlayer';

import 'App.css';

const App = () => {
  // #region Zmienne stanu (useState Hooks)
  const [playingTrackID, setPlayingTrackID] = useState(null);
  // #endregion

  // #region Obsługa zdarzeń (Event Handlers)
  const handleEmbedPlaybackToggle = (paused, embeddedPlayer_playingTrackID) => {
      setPlayingTrackID(paused ? null : embeddedPlayer_playingTrackID);
  }
  const handlePlaybackToggle = (trackID) => {
    if(playingTrackID !== trackID) {
        setPlayingTrackID(trackID);
    }
    else {
        setPlayingTrackID(null);
    }
  }
  // #endregion
  
  // #region Struktura komponentu (JSX)
  const playbackAttributes = {playingTrackID: playingTrackID, onPlaybackToggle: handlePlaybackToggle};
  return (
    <>
      <EmbeddedPlayer playingTrackID = {playingTrackID} onPlaybackToggle = {handleEmbedPlaybackToggle} />
      <Routes>
        <Route path = '/' element = {<HomePage {...playbackAttributes} />} />
        <Route path = 'playlist/:id' element = {<PlaylistPage {...playbackAttributes} />} />
        <Route path = 'album/:id' element = {<AlbumPage {...playbackAttributes} />} />
        <Route path = 'artist/:id' element = {<ArtistPage {...playbackAttributes} />} />
        <Route path = 'settings' element = {<SettingsPage {...playbackAttributes} />} />
        <Route path = 'search' element = {<SearchPage {...playbackAttributes} />} />
      </Routes>
    </> 
  );
  // #endregion
}

export default App;