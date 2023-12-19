import { Route, Routes } from 'react-router-dom';

import HomePage from 'pages/Home';
import PlaylistPage from 'pages/Playlist';
import PlaylistGeneratorPage from 'pages/PlaylistGenerator';
import AlbumPage from 'pages/Album';
import SettingsPage from "pages/Settings";

import 'App.css';

const App = () => {
  return (
    <Routes>
      <Route path = '/' element = {<HomePage />} />
      <Route path = 'playlist/:id' element = {<PlaylistPage />} /> {/* "/:id" prowadzi do podstrony konkretnej listy odtwarzania */}
      <Route path = 'album/:id' element = {<AlbumPage />} /> {/* "/:id" prowadzi do podstrony konkretnego albumu */}
      <Route path = 'generator' element = {<PlaylistGeneratorPage />} />
      <Route path = 'settings' element = {<SettingsPage />} />
    </Routes>
  );
}

export default App;