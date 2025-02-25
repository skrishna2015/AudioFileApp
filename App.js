import React from 'react';
import { ExpoRoot } from 'expo-router';

export default function App() {
  // Add the context
  const ctx = require.context('./app');
  return <ExpoRoot context={ctx} />;
}