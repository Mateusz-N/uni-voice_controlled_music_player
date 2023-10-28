import PlaybackPanel from './components/PlaybackPanel';
import './App.css';

const App = () => {
  return (
    <div id = 'page'>
      <div id = 'content'></div>
      <PlaybackPanel trackDuration_ms = "15000"></PlaybackPanel>
    </div>
  );
}

export default App;