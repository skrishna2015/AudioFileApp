import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function FileDetailsScreen() {
  const router = useRouter();
  const { name, type, uri } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="chevron-back" size={24} color="#000" />
      </TouchableOpacity>
      <Text style={styles.header}>{name}</Text>
      <View style={styles.fileContainer}>
        <Text style={styles.fileText}>Welcome to {name}, the channel that guarantees laughter and fun!</Text>
        <Text style={styles.fileText}>Hey there, hilarious humans! I'm your host, and this is the place where laughter knows no bounds. We're here to tickle your funny bone and brighten up your day with our side-splitting content.</Text>
        <Text style={styles.fileText}>Whether it's pranks, challenges, or outrageous skits, {name} is your go-to destination for non-stop amusement. Our team of comedic wizards is always cooking up something absurd and entertaining just for you.</Text>
        <Text style={styles.fileText}>We're not just about creating laughter; we're all about spreading joy and positivity. So, sit back, relax, and get ready for endless fun!</Text>
      </View>
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
  header: {
    textAlign: 'center',
    fontSize: 18,
    //fontWeight: '600',
    marginTop: 20,
    marginBottom: 20
  },
  contentContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
  },
  fileTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  fileDetails: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  fileContainer: {
    margin: 20,
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  fileText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
});
