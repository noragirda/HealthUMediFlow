import { Stack } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import FloatingBubble from './FloatingBubble'; // Import the FloatingBubble component

export default function Layout() {
  return (
    <View style={styles.container}>
      {/* Stack Navigation */}
      <Stack>
        {/* Welcome Page */}
        <Stack.Screen name="index" options={{ headerShown: false }} />

        {/* Login Page */}
        <Stack.Screen name="login" options={{ headerShown: false }} />

        {/* Tabs Navigation */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>

      {/* Floating Bubble */}
      <FloatingBubble />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ensure the container takes the full screen height
  },
});
