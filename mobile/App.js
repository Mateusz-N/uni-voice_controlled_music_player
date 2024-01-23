import React, { useState } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import axios from 'axios';

const App = () => {
  const [command, setCommand] = useState('');

  const sendVoiceCommand = async (command) => {
    try {
      await axios.post(`${process.env.SERVER_URL_HTTP}/remote-voice-command`, { command });
    }
    catch(error) {
      console.error('Error sending voice command:', error);
    }
  };

  const handleVoiceCommand = () => {
    const voiceCommand = 'zaloguj';
    setCommand(voiceCommand);
    sendVoiceCommand(voiceCommand);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

  return (
    <View style = {styles.container}>
      <Text>Remote Control App</Text>
      <Button title = "Send Voice Command" onPress = {handleVoiceCommand} />
      <Text>Last Voice Command: {command}</Text>
    </View>
  );
};

export default App;