import { useState } from 'react';
import { StyleSheet, View, Text, Image, Button, TouchableWithoutFeedback } from 'react-native';
import axios from 'axios';

import microphone_idle from './assets/microphone_idle.png';
import microphone_active from './assets/microphone_active.png';

const App = () => {
  // #region Zmienne stanu (useState Hooks)
  const [command, setCommand] = useState('');
  const [microphoneEnabled, setMicrophoneEnabled] = useState(false);
  const [microphoneActive, setMicrophoneActive] = useState(false);
  // #endregion

    // #region Obsługa zdarzeń (Event Handlers)
  const handleVoiceCommand = () => {
    const voiceCommand = 'zaloguj';
    setCommand(voiceCommand);
    sendVoiceCommand(voiceCommand);
  };
  const handleToggleMicrophone = () => {
    setMicrophoneEnabled(prevState => !prevState);
  }
  // #endregion

  // #region Funkcje pomocnicze
  const sendVoiceCommand = async (command) => {
    try {
      await axios.post(`${process.env.SERVER_URL_HTTP}/remote-voice-command`, { command });
    }
    catch(error) {
      console.error('Error sending voice command:', error);
    }
  };
  // #endregion

  // #region Arkusz stylów
  const Styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#222',
      alignItems: 'center',
      justifyContent: 'center',
    },
    microphoneIcon: {
      height: undefined,
      width: '75%',
      aspectRatio: 1/1,
      padding: 10
    },
    microphoneIcon_disabled: {
      opacity: 0.5
    }
  });
  // #endregion

  // #region Struktura komponentu (JSX)
  return (
    <View style = {Styles.container}>
      <TouchableWithoutFeedback onPress = {handleToggleMicrophone}>
        <Image
            source = {microphoneActive ? microphone_active : microphone_idle}
            alt = {microphoneEnabled ? (microphoneActive ? 'Capturing voice...' : 'Awaiting input...') : 'Microphone off'}
            style = {microphoneEnabled ? Styles.microphoneIcon : [Styles.microphoneIcon, Styles.microphoneIcon_disabled]}
          />
      </TouchableWithoutFeedback>
    </View>
  );
  // #endregion
};

export default App;