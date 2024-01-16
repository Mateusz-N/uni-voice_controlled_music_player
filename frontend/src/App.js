import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';

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
  const [playingTrackEnded, setPlayingTrackEnded] = useState(false);
  // #endregion

  // #region Obsługa zdarzeń (Event Handlers)
  const handleEmbedPlaybackToggle = (paused, embeddedPlayer_playingTrack) => {
    if(paused.ended) {
      setPlayingTrackEnded(true);
      return;
    }
    if(!paused.state) {
      setPlayingTrack(embeddedPlayer_playingTrack);
      return;
    }
    if(!playingTrackEnded) {
      setPlayingTrack({id: null, title: null, artistName: null, albumName: null, duration: null});
    }
  }
  const handlePlaybackToggle = (track) => {
    if(playingTrackEnded) {
      setPlayingTrackEnded(false);
      setPlayingTrack({id: track.id, title: track.title, artistName: track.artists[0].name, albumName: track.album.name, duration: track.duration_ms});
      return;
    }
    if(playingTrack.id !== track.id) {
      setPlayingTrack({id: track.id, title: track.title, artistName: track.artists[0].name, albumName: track.album.name, duration: track.duration_ms});
      return;
    }
    setPlayingTrack({id: null, title: null, artistName: null, albumName: null, duration: null});
  }
  const handleTrackEnd = () => {
    setPlayingTrack(playingTrack);
  }
  // #endregion
  
  // #region Struktura komponentu (JSX)
  const universalProps = {playingTrack: {...playingTrack, ended: playingTrackEnded}, onPlaybackToggle: handlePlaybackToggle};
  return (
    <>
      <EmbeddedPlayer playingTrack = {{...playingTrack, ended: playingTrackEnded}} onPlaybackToggle = {handleEmbedPlaybackToggle} onTrackEnd = {handleTrackEnd} />
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