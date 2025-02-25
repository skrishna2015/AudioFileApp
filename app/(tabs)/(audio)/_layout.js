import { Stack } from 'expo-router';

export default function AudioLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="newrecording"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="details"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
} 