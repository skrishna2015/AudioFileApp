import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Image } from 'react-native';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as FileSystem from 'expo-file-system';

export default function NewRecordingScreen() {
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [audioUri, setAudioUri] = useState(null);
  const [duration, setDuration] = useState(0);
  const [recordingName, setRecordingName] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSound, setPlaybackSound] = useState(null);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const router = useRouter();
  
  // Use useRef for interval to prevent memory leaks
  const recordingInterval = React.useRef(null);
  const playbackTimer = React.useRef(null);

  useEffect(() => {
    return () => {
      if (recording) recording.unloadAsync();
      if (playbackSound) playbackSound.unloadAsync();
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
      }
      if (playbackTimer.current) {
        clearInterval(playbackTimer.current);
      }
    };
  }, []);

  // Generate a random name for the recording
  const generateRecordingName = () => {
    const timestamp = new Date().getTime();
    const randomString = Math.random().toString(36).substring(2, 8);
    return `audio_${timestamp}_${randomString}.mp3`;
  };

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') {
        alert('Permission to access microphone is required!');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(newRecording);
      setIsRecording(true);
      setRecordingTime(0);

      // Clear any existing interval
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
      }

      // Start new timer
      recordingInterval.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Failed to start recording', error);
    }
  };

  const stopRecording = async () => {
    try {
      if (!recording) return;

      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
      }

      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      
      // Get the URI immediately after stopping
      const uri = recording.getURI();
      console.log('Recording URI:', uri); // Debug log

      // Load the recording for playback and verify it
      const { sound, status } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: false }
      );
      
      console.log('Sound loaded status:', status); // Debug log to verify sound loading
      console.log('Sound duration:', status.durationMillis); // Debug log for duration
      
      setPlaybackSound(sound);
      setDuration(status.durationMillis);
      setAudioUri(uri);
      setRecordingName(generateRecordingName());
      setShowModal(true);

    } catch (error) {
      console.error('Failed to stop recording:', error);
    }
  };

  const togglePlayback = async () => {
    try {
      if (!playbackSound) {
        console.log('No playback sound available');
        return;
      }

      if (isPlaying) {
        await playbackSound.pauseAsync();
        if (playbackTimer.current) {
          clearInterval(playbackTimer.current);
          playbackTimer.current = null;
        }
      } else {
        const status = await playbackSound.getStatusAsync();
        if (status.isLoaded) {
          await playbackSound.playAsync();
          
          // Start timer to update playback position
          playbackTimer.current = setInterval(async () => {
            const status = await playbackSound.getStatusAsync();
            setPlaybackPosition(status.positionMillis);
          }, 100);

          // Set up playback status monitoring
          playbackSound.setOnPlaybackStatusUpdate((status) => {
            if (status.didJustFinish) {
              setIsPlaying(false);
              setPlaybackPosition(0);
              if (playbackTimer.current) {
                clearInterval(playbackTimer.current);
                playbackTimer.current = null;
              }
            }
          });
        } else {
          console.log('Sound not loaded properly');
        }
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error('Playback error:', error);
    }
  };

  // Add this helper function to convert bytes to MB
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 MB';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const saveRecording = async () => {
    try {
      if (!audioUri) {
        console.error('No audio URI available');
        return;
      }

      // Get file info using expo-file-system
      const fileInfo = await FileSystem.getInfoAsync(audioUri);
      const fileSize = fileInfo.size ? formatFileSize(fileInfo.size) : '0 MB';

      // Fetch current recordings first
      const storedRecordings = await AsyncStorage.getItem('recordings');
      const existingRecordings = storedRecordings ? JSON.parse(storedRecordings) : [];
      
      const minutes = Math.floor(duration / 60000);
      const seconds = Math.floor((duration % 60000) / 1000);
      
      const newRecording = {
        id: Date.now().toString(),
        name: recordingName,
        duration: `${minutes}m ${seconds}s`,
        size: fileSize,
        uri: audioUri,
      };

      console.log('Saving new recording:', newRecording);

      const updatedRecordings = [...existingRecordings, newRecording];
      
      // Save to AsyncStorage
      await AsyncStorage.setItem('recordings', JSON.stringify(updatedRecordings));
      console.log('Successfully saved recordings to AsyncStorage');

      // Cleanup
      if (playbackSound) {
        await playbackSound.unloadAsync();
      }
      
      setPlaybackSound(null);
      setRecording(null);
      setRecordingTime(0);
      setShowModal(false);

      // Force an immediate refresh of the recordings list
      await AsyncStorage.setItem('lastUpdate', Date.now().toString());
      
      // Navigate back with refresh parameter
      router.back();
      
      // Small delay to ensure navigation is complete before refresh
      setTimeout(() => {
        router.setParams({ refresh: Date.now().toString() });
      }, 100);

    } catch (error) {
      console.error('Detailed save error:', error);
      Alert.alert(
        'Save Error',
        'Failed to save recording. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')} : ${secs.toString().padStart(2, '0')}`;
  };

  const formatDuration = (millis) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = Math.floor((millis % 60000) / 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>EKSAQ library</Text>
      <View style={styles.recordingView}>
        {isRecording ? (
          <>
            <View style={styles.waveform}>
              {/* Add waveform visualization here */}
            </View>
            <Text style={styles.timerText}>{formatTime(recordingTime)}</Text>
            <TouchableOpacity
              style={styles.doneButton}
              onPress={stopRecording}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              style={styles.micButton}
              onPress={startRecording}
            >
              <Ionicons name="mic" size={32} color="#4CAF50" />
            </TouchableOpacity>
            <Text style={styles.instructionText}>Click on the button to start recording</Text>
          </>
        )}
      </View>

      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => {
                if (playbackSound) playbackSound.unloadAsync();
                setShowModal(false);
              }}
            >
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
            
            <View style={styles.modalHeader}>
              <Image 
                  source={require('../../../assets/music.png')} 
                  style={styles.audioImage}
                />
              <Text style={styles.modalTitle}>Audio Generated!</Text>
              <Text style={styles.fileName}>{recordingName}</Text>
            </View>
            
            <View style={styles.audioPlayer}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressIndicator, 
                    { 
                      width: `${(playbackPosition / duration) * 100}%` 
                    }
                  ]} 
                />
              </View>
              <View style={styles.timeContainer}>
                <Text>{formatDuration(playbackPosition)}</Text>
                <Text>{formatDuration(duration)}</Text>
              </View>
              <TouchableOpacity 
                style={styles.playButton}
                onPress={togglePlayback}
              >
                <Ionicons 
                  name={isPlaying ? "pause" : "play"} 
                  size={32} 
                  color="#007AFF" 
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.saveButton}
              onPress={saveRecording}
            >
              <Text style={styles.saveButtonText}>Save audio</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  audioImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    marginLeft: 20,
    textAlign:'center',
    marginTop: 20,
    marginBottom: 20,
    fontWeight: '700',
  },
  recordingView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  instructionText: {
    fontSize: 16,
    color: '#666',
  },
  waveform: {
    height: 100,
    width: '80%',
    backgroundColor: '#F5F5F5',
    marginBottom: 20,
  },
  timerText: {
    fontSize: 32,
    marginBottom: 30,
  },
  doneButton: {
    backgroundColor: '#1A237E',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  doneButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  modalHeader: {
    alignItems: 'center',
    marginVertical: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  fileName: {
    fontSize: 16,
    color: '#666',
  },
  audioPlayer: {
    width: '100%',
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E0E0E0',
    width: '100%',
    borderRadius: 2,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingHorizontal: 5,
  },
  playButton: {
    alignSelf: 'center',
    marginTop: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#1A237E',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  progressIndicator: {
    height: 4,
    backgroundColor: '#007AFF',
    borderRadius: 2,
    position: 'absolute',
    left: 0,
  },
}); 