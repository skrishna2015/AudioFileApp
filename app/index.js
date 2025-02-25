import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Link } from 'expo-router';

export default function Welcome() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/splash.png')}
        style={styles.image}
      />
      <Text style={styles.title}>Welcome to EKSAQ</Text>
      <Link href="/(tabs)/(audio)" asChild>
        <TouchableOpacity style={styles.arrowButton}>
          <Text style={styles.arrowText}>→</Text>
        </TouchableOpacity>
      </Link>
      <View style={styles.pageIndicator}>
        <View style={styles.dotActive} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    marginBottom: 10,
  },
  arrowButton: {
    marginTop: 10
  },
  arrowText: {
    fontSize: 24,
    fontWeight: '900',
  },
  pageIndicator: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 40,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 4,
  },
  dotActive: {
    width: 100,
    height: 6,
    borderRadius: 4,
    backgroundColor: '#1A237E',
    marginHorizontal: 4,
  },
});