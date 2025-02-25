import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          paddingHorizontal: 40,
        },
      }}
    >
      <Tabs.Screen
        name="(audio)"
        options={{
          title: 'Audio',
          tabBarIcon: ({ focused, color }) => (
            <View style={{ flex: 1, alignItems: 'flex-start' }}>
              <Ionicons 
                name={focused ? 'musical-note' : 'musical-note'} 
                size={24} 
                color={color} 
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="(files)"
        options={{
          title: 'Files',
          tabBarIcon: ({ focused, color }) => (
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <Ionicons 
                name={focused ? 'share-outline' : 'share-outline'} 
                size={24} 
                color={color} 
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
} 