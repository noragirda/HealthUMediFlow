import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { logoutUser, checkSession } from '../../hooks/api';

export default function HomePage() {
  const router = useRouter();
  interface User {
    firstName: string;
    lastName: string;
  }

  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    };
    fetchUserData();
  }, []);
 
  const handleLogout = async () => {
    await logoutUser();
   router.push('/login'); // Redirect to login after logout
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Top Right Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

      {/* Greeting Section */}
      <View style={styles.greetingContainer}>
        <Text style={styles.greeting}>
          👋 Hello, {user ? `${user.firstName} ${user.lastName}` : 'User'}!
        </Text>
        
        <Text style={styles.subGreeting}>Your health journey starts here.</Text>
        
      </View>

      {/* Section 1: Take It In */}
      <View style={styles.section}>
        <View style={styles.textContainer}>
          <Text style={styles.sectionTitle}>Take charge of your health!</Text>
        </View>
        <Image
          source={require('../../assets/images/TakeItIn.png')}
          style={styles.sectionImage}
        />
      </View>

      {/* Section 2: Trends */}
      <View style={styles.section}>
        <Image
          source={require('../../assets/images/trends.png')}
          style={styles.sectionImage}
        />
        <View style={styles.textContainer}>
          <Text style={styles.sectionTitle}>
            Your health trends are waiting for you
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/result-evolution')} // Navigate to trends.tsx
          >
            <Text style={styles.buttonText}>Explore Trends</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Section 3: Symptoms */}
      <View style={styles.weatherSection}>
        <Image
          source={require('../../assets/images/underTheWeather.png')}
          style={styles.weatherImage}
        />
        <View style={styles.weatherTextContainer}>
          <Text style={styles.weatherTitle}>Feeling under the weather?</Text>
          <Text style={styles.weatherSubtitle}>
            Log your symptoms or start a HealthChat to get advice.
          </Text>
          <View style={styles.weatherButtons}>
            <TouchableOpacity style={styles.weatherButton} onPress={() => router.push('/(tabs)/symptom-log')}>
              <Text style={styles.weatherButtonText}>Log Symptoms</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.weatherButton} onPress={() => router.push('/(tabs)/healthchat')}>
              <Text style={styles.weatherButtonText}>HealthChat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Section 4: Appointments */}
      <View style={styles.section}>
        <Image
          source={require('../../assets/images/appointmentphoto.png')}
          style={styles.sectionImage}
        />
        <View style={styles.textContainer}>
          <Text style={styles.sectionTitle}>
            Book an appointment with ease!
          </Text>
          <TouchableOpacity style={styles.button} onPress={() => router.push('/(tabs)/appointments')}>
            <Text style={styles.buttonText}>Schedule Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: '#E8F5FF', // Baby blue
  },
  
  greetingContainer: {
    alignItems: 'center',
    marginTop: 15, // Push the greeting further down
    marginBottom: 30,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3D5A80', // Deep pastel blue
    textAlign: 'center',
  },
  subGreeting: {
    fontSize: 16,
    color: '#555555', // Light gray
    marginTop: 5,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: '#FFFFFF', // White background for sections
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  textContainer: {
    flex: 1,
    paddingRight: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3D5A80', // Deep pastel blue
    marginBottom: 10,
    textAlign: 'center',
  },
  sectionImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  button: {
    backgroundColor: '#F9A826', // Vibrant orange
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5, // Shadow for Android
  },
  buttonText: {
    color: '#FFFFFF', // White text
    fontSize: 16,
    fontWeight: 'bold',
  },
  weatherSection: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: '#FFFFFF', // White background for sections
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4, // Shadow for Android
  },
  weatherImage: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  weatherTextContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  weatherTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3D5A80', // Deep pastel blue
    textAlign: 'center',
    marginBottom: 10,
  },
  weatherSubtitle: {
    fontSize: 14,
    color: '#555555', // Light gray
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  weatherButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10, // Adds space between buttons
  },
  weatherButton: {
    backgroundColor: '#F9A826', // Vibrant orange
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  logoutButton: {
    position: 'absolute',
    top: 10, // Move closer to the top
    right: 5, // Move closer to the right edge
    backgroundColor: '#FF6F91', // Pink color for logout button
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50, // Fully rounded button
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  
  logoutButtonText: {
    color: '#FFFFFF', // White text
    fontSize: 14,
    fontWeight: 'bold',
  },
  weatherButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
