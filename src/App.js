import PlaybackPanel from './components/PlaybackPanel';
import placeholderAlbumCoverSrc from './resources/albumCover_placeholder.png';
import './App.css';

const App = () => {
  return (
    <div id = 'page'>
      <div id = 'content'></div>
      <PlaybackPanel track =
        {{
          duration_ms: '15000',
          trackTitle: 'Song',
          artist: 'Artist',
          albumTitle: 'Album',
          albumCoverSrc: placeholderAlbumCoverSrc
        }}
      ></PlaybackPanel>
    </div>
  );
}

export default App;