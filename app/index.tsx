import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function WelcomePage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Decorative Top Shape */}
      <View style={styles.topShape} />

      {/* Logo at the top */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/images/logo.png')} // Update this to your actual logo path
          style={styles.logo}
        />
      </View>

      {/* Welcome message */}
      <Text style={styles.welcomeText}>
        Welcome to <Text style={styles.highlight}>HealthUMediFlow</Text>!{'\n'}
        Take your health into your own hands!
      </Text>

      {/* Decorative Image */}
      <Image
        source={require('../assets/images/healthDecor.png')} // Add a decorative image (optional)
        style={styles.decorativeImage}
      />

      {/* Button to navigate to Login Page */}
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => router.push('/login')} // Navigate to the login page
      >
        <Text style={styles.loginButtonText}>Login and get started!</Text>
      </TouchableOpacity>

      {/* Footer Shape */}
      <View style={styles.footerShape} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8F5FF', // Soft pastel baby blue background
    padding: 20,
    position: 'relative',
  },
  topShape: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '25%',
    backgroundColor: '#A8E6CF', // Pastel green shape
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  logoContainer: {
    backgroundColor: '#FFE6E6', // Pastel pink background for logo container
    padding: 20,
    borderRadius: 150, // Circular effect around the logo
    marginBottom: 20, // Adjusted to move everything else up
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5, // Shadow for Android
  },
  logo: {
    width: 250,
    height: 250,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#3D5A80', // Deep pastel blue for text
    marginBottom: 20, // Adjusted for spacing
    lineHeight: 30,
    paddingHorizontal: 20,
  },
  highlight: {
    color: '#FF6F61', // Highlight color for the app name
  },
  decorativeImage: {
    width: 220,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 10, // Adjusted to bring the image up
    marginTop: -50, // Negative margin to move it higher
  },
  loginButton: {
    backgroundColor: '#FF6F61', // Vibrant coral color for the button
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5, // Shadow for Android
    marginTop: -10, // Negative margin to move it higher
  },
  loginButtonText: {
    color: '#FFFFFF', // White text
    fontWeight: 'bold',
    fontSize: 18,
  },
  footerShape: {
    position: 'absolute',
    bottom: -70, // Move the footer shape further down
    left: 0,
    width: '100%',
    height: '20%',
    backgroundColor: '#FFB6C1', // Pastel pink footer shape
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
});

