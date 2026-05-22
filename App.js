import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { Audio } from 'expo-av';

export default function App() {
  const [recording, setRecording] = useState(null);
  const [audioUri, setAudioUri] = useState(null);

  async function startRecording() {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status === 'granted') {
        await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
        const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
        setRecording(recording);
      }
    } catch (err) { console.error(err); }
  }

  async function stopRecording() {
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    setAudioUri(recording.getURI());
  }

  async function playVoice(pitchValue) {
    if (!audioUri) return Alert.alert('Aviso', 'Grave um áudio primeiro!');
    const { sound } = await Audio.Sound.createAsync(
      { uri: audioUri },
      { shouldPlay: true, pitch: pitchValue, rate: pitchValue === 1.6 ? 1.3 : 0.8, shouldCorrectPitch: false }
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎙️ Meu Modificador de Voz</Text>
      <TouchableOpacity style={[styles.btn, recording && {backgroundColor: 'red'}]} onPress={recording ? stopRecording : startRecording}>
        <Text style={styles.btnText}>{recording ? '🛑 PARAR' : '🔴 GRAVAR VOZ'}</Text>
      </TouchableOpacity>
      <View style={{flexDirection: 'row', marginTop: 20}}>
        <TouchableOpacity style={styles.btnEfeito} onPress={() => playVoice(1.6)}><Text style={styles.btnText}>🐿️ Esquilo</Text></TouchableOpacity>
        <TouchableOpacity style={styles.btnEfeito} onPress={() => playVoice(0.6)}><Text style={styles.btnText}>👹 Monstro</Text></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 22, color: '#fff', marginBottom: 30, fontWeight: 'bold' },
  btn: { backgroundColor: '#007AFF', padding: 20, borderRadius: 50, width: 200, alignItems: 'center' },
  btnEfeito: { backgroundColor: '#333', padding: 15, borderRadius: 10, margin: 10, width: 120, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' }
});
