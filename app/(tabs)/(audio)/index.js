import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal } from 'react-native';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter, useNavigation } from 'expo-router';

export default function AudioScreen() {
  const [recordings, setRecordings] = useState([]);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(null);
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [showRecordingModal, setShowRecordingModal] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  let recordingInterval;
  const router = useRouter();
  const navigation = useNavigation();
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('Screen focused - refreshing recordings');
      loadRecordings();
      setRefreshKey(prev => prev + 1);
    });

    loadRecordings();

    return () => {
      if (sound) sound.unloadAsync();
      if (recording) recording.unloadAsync();
      clearInterval(recordingInterval);
      unsubscribe();
    };
  }, [navigation]);

  useEffect(() => {
    console.log('Recordings updated:', recordings);
  }, [recordings]);

  const loadRecordings = async () => {
    try {
      console.log('Loading recordings...');
      const storedRecordings = await AsyncStorage.getItem('recordings');
      if (storedRecordings) {
        const parsedRecordings = JSON.parse(storedRecordings);
        console.log('Loaded recordings:', parsedRecordings);
        setRecordings(parsedRecordings);
      } else {
        console.log('No recordings found in storage');
        setRecordings([]);
      }
    } catch (error) {
      console.error('Error loading recordings:', error);
    }
  };

  const startRecording = async () => {
    router.push('/(tabs)/newrecording');
  };

  const playSound = (item) => {
    console.log(item);
    router.push({
      pathname: "/(tabs)/(audio)/details",
      params: { 
        id: item.id,
        uri: item.uri,
        name: item.name,
        duration: item.duration,
        size: item.size
      }
    });
    // try {
    //   if (sound) {
    //     await sound.unloadAsync();
    //   }

    //   if (isPlaying === audioId) {
    //     setIsPlaying(null);
    //     return;
    //   }

    //   const { sound: newSound } = await Audio.Sound.createAsync({ uri: recordings.find(r => r.id === audioId).uri });
    //   setSound(newSound);
    //   setIsPlaying(audioId);

    //   newSound.setOnPlaybackStatusUpdate((status) => {
    //     if (status.didJustFinish) {
    //       setIsPlaying(null);
    //     }
    //   });
    // } catch (error) {
    //   console.error('Failed to play sound:', error);
    // }
  };

  const renderAudioItem = ({ item }) => (
    <View style={styles.audioItem}>
      <View style={styles.audioInfo}>
        <View style={styles.iconContainer}>
          <Ionicons name="mic-circle" size={32} color="#007AFF" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.audioName}>{item.name}</Text>
          <Text style={styles.audioDetails}>
            {item.duration} • {item.size}
          </Text>
        </View>
      </View>
      <TouchableOpacity 
        style={styles.playButton}
        onPress={
          () => router.push({
          pathname: "/(tabs)/(audio)/details",
          params: { 
            id: item.id,
            uri: item.uri,
            name: item.name,
            duration: item.duration,
            size: item.size
          }
        })
      }
      >
        <Ionicons 
          name={isPlaying === item.id ? "pause" : "play"} 
          size={24} 
          color="#007AFF" 
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.safeContainer}>
      <View style={styles.header}>
        <Text style={styles.headerSmall}>EKSAQ library</Text>
        <Text style={styles.headerLarge}>Audio Library</Text>
        <TouchableOpacity 
        style={styles.addButton}
        onPress={startRecording}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
      </View>
      <View style={styles.listContainer}>
        <FlatList
          data={recordings}
          renderItem={renderAudioItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          key={refreshKey}
          extraData={refreshKey}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    padding: 20,
    paddingTop: 60, // Adds space for status bar
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: 20,
    paddingBottom: 100, // Extra padding for FAB
  },
  headerSmall: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '700',
  },
  headerLarge: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A237E',
    marginBottom: 10,
  },
  audioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  audioInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  audioDetails: {
    marginLeft: 10,
  },
  audioName: {
    fontSize: 16,
    fontWeight: '500',
  },
  audioDuration: {
    fontSize: 12,
    color: '#666',
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 18,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1A237E',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  addButtonText: {
    fontSize: 24,
    fontWeight: '600',
    color: 'white',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  recordingStartView: {
    alignItems: 'center',
    padding: 20,
  },
  recordingView: {
    alignItems: 'center',
    padding: 20,
  },
  micButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  recordingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  timerText: {
    fontSize: 48,
    fontWeight: '600',
    color: '#000',
    marginBottom: 30,
  },
  stopButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  stopButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  iconContainer: {
    marginRight: 10,
  },
  textContainer: {
    flexDirection: 'column',
  },
  playButton: {
    padding: 10,
  },
});
