import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Cookies from 'js-cookie';

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
  const [playingTrack, setPlayingTrack] = useState({id: null, title: null, artistName: null, albumName: null, duration: null});
  // #endregion

  // #region Obsługa zdarzeń (Event Handlers)
  const handleEmbedPlaybackToggle = (paused, embeddedPlayer_playingTrack) => {
      setPlayingTrack(paused ? {id: null, title: null, artistName: null, albumName: null, duration: null} : embeddedPlayer_playingTrack);
  }
  const handlePlaybackToggle = (track) => {
      if(playingTrack.id !== track.id) {
          setPlayingTrack({id: track.id, title: track.title, artistName: track.artists[0].name, albumName: track.album.name, duration: track.duration_ms});
          return;
      }
      setPlayingTrack({id: null, title: null, artistName: null, albumName: null, duration: null});
  }
  // #endregion
  
  // #region Struktura komponentu (JSX)
  const universalProps = {playingTrack: playingTrack, onPlaybackToggle: handlePlaybackToggle};
  return (
    <>
      <EmbeddedPlayer playingTrack = {playingTrack} onPlaybackToggle = {handleEmbedPlaybackToggle} />
      <Routes>
        <Route path = '/' element = {<HomePage {...universalProps} />} />
        <Route path = 'playlist/:id' element = {<PlaylistPage {...universalProps} />} />
        <Route path = 'album/:id' element = {<AlbumPage {...universalProps} />} />
        <Route path = 'artist/:id' element = {<ArtistPage {...universalProps} />} />
        <Route path = 'settings' element = {<SettingsPage {...universalProps} />} />
        <Route path = 'search' element = {<SearchPage {...universalProps} />} />
      </Routes>
    </> 
  );
  // #endregion
}

export default App;