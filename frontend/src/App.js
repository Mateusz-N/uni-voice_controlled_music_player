import { Route, Routes } from 'react-router-dom';

import HomePage from 'pages/Home';
import PlaylistPage from 'pages/Playlist';
import AlbumPage from 'pages/Album';
import ArtistPage from 'pages/Artist';
import SettingsPage from "pages/Settings";
import SearchPage from "pages/Search";

import 'App.css';

const App = () => {
  return (
    <Routes>
      <Route path = '/' element = {<HomePage />} />
      <Route path = 'playlist/:id' element = {<PlaylistPage />} /> {/* "/:id" prowadzi do podstrony konkretnej listy odtwarzania */}
      <Route path = 'album/:id' element = {<AlbumPage />} />
      <Route path = 'artist/:id' element = {<ArtistPage />} />
      <Route path = 'settings' element = {<SettingsPage />} />
      <Route path = 'search' element = {<SearchPage />} />
    </Routes>
  );
}

export default App;