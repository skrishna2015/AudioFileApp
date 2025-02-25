import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, Image } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function FilesScreen() {
  const router = useRouter();
  const [files, setFiles] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentFileName, setCurrentFileName] = useState('');

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      const storedFiles = await AsyncStorage.getItem('files');
      if (storedFiles) {
        setFiles(JSON.parse(storedFiles));
      }
    } catch (error) {
      console.error('Error loading files:', error);
    }
  };

  // const pickDocument123 = async () => {
  //   try {
  //     const result = await DocumentPicker.getDocumentAsync({
  //       type: '*/*',
  //       copyToCacheDirectory: true,
  //     });

  //     if (result.assets && result.assets[0]) {
  //       setCurrentFileName(result.assets[0].name);
  //       setIsUploading(true);
        
  //       // Simulate upload progress
  //       let progress = 0;
  //       const progressInterval = setInterval(() => {
  //         progress += 5;
  //         setUploadProgress(progress);
          
  //         if (progress >= 100) {
  //           clearInterval(progressInterval);
  //           const newFile = {
  //             id: Date.now().toString(),
  //             name: result.assets[0].name,
  //             uri: result.assets[0].uri,
  //             type: result.assets[0].mimeType,
  //           };

  //           const updatedFiles = [...files, newFile];
  //           setFiles(updatedFiles);
  //           AsyncStorage.setItem('files', JSON.stringify(updatedFiles));
            
  //           // Reset and close modal
  //           setTimeout(() => {
  //             setIsUploading(false);
  //             setIsModalVisible(false);
  //             setUploadProgress(0);
  //           }, 500);
  //         }
  //       }, 100);
  //     }
  //   } catch (error) {
  //     console.error('Error picking document:', error);
  //     setIsUploading(false);
  //     setIsModalVisible(false);
  //   }
  // };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });
  
      if (result.assets && result.assets[0]) {
        const fileExists = files.some(file => file.name === result.assets[0].name);
        
        if (fileExists) {
          alert("This file already exists!");
          return;
        }
  
        setCurrentFileName(result.assets[0].name);
        setIsUploading(true);
  
        // Simulate upload progress
        let progress = 0;
        const progressInterval = setInterval(() => {
          progress += 5;
          setUploadProgress(progress);
  
          if (progress >= 100) {
            clearInterval(progressInterval);
            const newFile = {
              id: Date.now().toString(),
              name: result.assets[0].name,
              uri: result.assets[0].uri,
              type: result.assets[0].mimeType,
            };
  
            const updatedFiles = [...files, newFile];
            setFiles(updatedFiles);
            AsyncStorage.setItem('files', JSON.stringify(updatedFiles));
  
            // Reset and close modal
            setTimeout(() => {
              setIsUploading(false);
              setIsModalVisible(false);
              setUploadProgress(0);
            }, 500);
          }
        }, 100);
      }
    } catch (error) {
      console.error('Error picking document:', error);
      setIsUploading(false);
      setIsModalVisible(false);
    }
  };
  

  const getFileIcon = (type) => {
    if (type?.includes('pdf')) return 'document-text';
    if (type?.includes('image')) return 'image';
    if (type?.includes('video')) return 'videocam';
    return 'document';
  };

  const renderUploadSection = () => (
    <View style={styles.uploadContainer}>
      <View style={styles.uploadCircle}>
      <Ionicons name="airplane" size={40} color="#6B7280" style={styles.planeIcon} />
      </View>
      <Text style={styles.uploadTitle}>Browse files</Text>
      <Text style={styles.uploadSubtitle}>Max file size - 10mb</Text>
    </View>
  );

  const renderFileItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.audioItem}
      onPress={() => {
        router.push({
          pathname: "/(tabs)/(files)/details",
          params: { 
            id: item.id,
            uri: item.uri,
            name: item.name,
            type: item.type
          }
        });
      }}
    >
      <View style={styles.audioInfo}>
        <View style={styles.iconContainer}>
          <Ionicons name={getFileIcon(item.type)} size={24} color="#1A237E" />
        </View>
        <View style={styles.audioDetails}>
          <Text style={styles.audioName}>{item.name}</Text>
          <Text style={styles.audioDuration}>{item.type}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const UploadModalContent = () => (
    <View style={styles.uploadModalContainer}>
      <View style={styles.illustrationContainer}>
        <Image 
          source={require('../../../assets/browse.png')} 
          style={styles.audioImage}
        />
      </View>

      <TouchableOpacity onPress={pickDocument}>
        <Text style={styles.modalTitle}>Browse files</Text>
      </TouchableOpacity>
      <Text style={styles.modalSubtitle}>Max file size - 10mb</Text>
    </View>
  );

  const UploadProgressContent = () => (
    <View style={styles.uploadModalContainer}>
      <View style={styles.illustrationContainer}>
      <Image 
          source={require('../../../assets/browse.png')} 
          style={styles.audioImage}
        />
      </View>
      <Text style={styles.modalTitle}>
        Uploading "{currentFileName}"
      </Text>
      <View style={styles.progressBarContainer}>
        <View 
          style={[
            styles.progressBar, 
            { width: `${uploadProgress}%` }
          ]} 
        />
      </View>
      <TouchableOpacity 
        style={styles.discardButton}
        onPress={() => {
          setIsUploading(false);
          setIsModalVisible(false);
          setUploadProgress(0);
        }}
      >
        <Text style={styles.discardButtonText}>Discard</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.safeContainer}>
      <View style={styles.header}>
        <Text style={styles.headerSmall}>EKSAQ Documents</Text>
        <Text style={styles.headerLarge}>Documents</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setIsModalVisible(true)}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.listContainer}>
        {files.length === 0 ? (
          <TouchableOpacity onPress={() => setIsModalVisible(true)}>
            {renderUploadSection()}
          </TouchableOpacity>
        ) : (
          <FlatList
            data={files}
            renderItem={renderFileItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => !isUploading && setIsModalVisible(false)}
        >
          <View style={styles.modalContent}>
            {isUploading ? <UploadProgressContent /> : <UploadModalContent />}
          </View>
        </TouchableOpacity>
      </Modal>
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
  audioImage: {
    width: 180,
    height: 180,
    marginBottom: 40,
    marginTop:20
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    maxWidth: 320,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
  },
  uploadModalContainer: {
    alignItems: 'center',
    padding: 16,
  },
  illustrationContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  planeIcon: {
    transform: [{ rotate: '45deg' }],
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
  },
  uploadButton: {
    backgroundColor: '#1A237E',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  uploadButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  uploadContainer: {
    alignItems: 'center',
  },
  uploadCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 10,
  },
  uploadSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  progressBarContainer: {
    width: '100%',
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    marginVertical: 24,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#1A237E',
    borderRadius: 3,
  },
  discardButton: {
    width: '100%',
    padding: 16,
    backgroundColor: '#6B7280',
    borderRadius: 8,
    alignItems: 'center',
  },
  discardButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
