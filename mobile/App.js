import { useState, useEffect } from 'react';
import { StyleSheet, View, Image, TouchableWithoutFeedback, ToastAndroid} from 'react-native';
import Voice from '@react-native-voice/voice';
import axios from 'axios';

import microphone_idle from './assets/microphone_idle.png';
import microphone_active from './assets/microphone_active.png';

const App = () => {
  // #region Zmienne globalne
  const SERVER_URL_HTTP = process.env.SERVER_URL_HTTP || process.env.EXPO_PUBLIC_SERVER_URL_HTTP || 'http://192.168.1.2:3030';
  // #endregion

  // #region Zmienne stanu (useState Hooks)
  const [microphoneEnabled, setMicrophoneEnabled] = useState(false);
  const [microphoneActive, setMicrophoneActive] = useState(false);
  const [voiceStarted, setVoiceStarted] = useState(false);
  // #endregion

    // #region Obsługa zdarzeń (Event Handlers)
  const handleVoiceCommand = (command) => {
    if(!command) {
      ToastAndroid.show('Unrecognized voice command. Please try again.', ToastAndroid.SHORT);
    }
    sendVoiceCommand(command);
  };
  const handleToggleMicrophone = () => {
    setMicrophoneEnabled(prevState => !prevState);
  }
  // #endregion

  // #region Funkcje pomocnicze
  const sendVoiceCommand = async (command) => {
    try {
      await axios.post(`${SERVER_URL_HTTP}/remote-voice-command`, { command });
    }
    catch(error) {
      ToastAndroid.show('Failed to send voice command. Please try again.', ToastAndroid.SHORT);
      console.error('Error sending voice command:', error);
    }
  }
  const setupSpeechRecognition = () => {
    Voice.onSpeechRecognized = () => {
      console.log('speechrecognized')
      setMicrophoneActive(true);
    }
    Voice.onSpeechPartialResults = () => {
      console.log('partialresults');
      // onSpeechRecognized z nieznanych przyczyn nie działa poprawnie...
      // Na szczęście, funkcja onSpeechPartialResults zostaje wywołana krótko po rozpoczęciu mowy...
      // Jest to więc przyzwoite zastępstwo funkcji onSpeechRecognized
      setMicrophoneActive(true);
    }
    Voice.onSpeechEnd = () => {
      console.log('speechend')
      setMicrophoneActive(false);
      setMicrophoneEnabled(false);
    }
    Voice.onSpeechResults = (event) => {
      console.log('speechresults');
      const command = event.value[0].toLowerCase().trim();
      handleVoiceCommand(command);
    }
    Voice.onSpeechError = (error) => {
      if(!voiceStarted) {
        return;
      }
      console.error(error);
      ToastAndroid.show('Something went wrong. Please try again.', ToastAndroid.SHORT);
    }
  }
  const startListening = async () => {
    try {
      console.log('voice capture started!')
      setVoiceStarted(true);
      await Voice.start('pl_PL');
    }
    catch(error) {
      console.error(error);
    }
  };
  const stopListening = async () => {
    try {
      console.log('stopping...')
      await Voice.stop();
      setMicrophoneActive(false);
      setVoiceStarted(false);
    }
    catch(error) {
      console.error(error);
    }
  }
  // #endregion

  // #region Wywołania zwrotne (useEffect Hooks)
  useEffect(() => {
    setupSpeechRecognition();
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  },[]);
  useEffect(() => {
    if(microphoneEnabled && !voiceStarted) {
      startListening();
      return;
    }
    if(!microphoneEnabled && voiceStarted) {
      stopListening();
    }
  },[microphoneEnabled, voiceStarted]);
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