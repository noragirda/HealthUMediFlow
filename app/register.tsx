import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { registerUser } from '../hooks/api'; // Import the registerUser function

export default function RegistrationPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    emergencyContact: '',
    country: '',
    countryEmergencyNumber: '',
    mainDoctor: '',
    bloodType: '',
    birthdate: '',
    gender: '',
  });

  const handleRegister = async () => {
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password ||
      !formData.phoneNumber ||
      !formData.emergencyContact
    ) {
      Alert.alert('Error', 'Please fill in all required fields!');
      return;
    }
  
    // Convert birthdate to YYYY-MM-DD format
    const birthdateParts = formData.birthdate.split(/[-/]/); // Split by - or /
    const formattedBirthdate = `${birthdateParts[2]}-${birthdateParts[1]}-${birthdateParts[0]}`;
  
    const userData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      phoneNumber: formData.phoneNumber,
      emergencyContact: formData.emergencyContact,
      country: formData.country,
      countryEmergencyNumber: formData.countryEmergencyNumber,
      mainDoctor: formData.mainDoctor,
      bloodType: formData.bloodType,
      birthdate: formattedBirthdate, // Use the reformatted date here
      gender: formData.gender,
    };
  
    try {
      const response = await registerUser(userData);
      if (response.message === 'User registered successfully') {
        Alert.alert('Success', 'Registration successful! You can now log in.');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          phoneNumber: '',
          emergencyContact: '',
          country: '',
          countryEmergencyNumber: '',
          mainDoctor: '',
          bloodType: '',
          birthdate: '',
          gender: '',
        });
      } else {
        Alert.alert('Error', response.message || 'Registration failed!');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred during registration.');
      console.error(error);
    }
  };
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Image
          source={require('../assets/images/register.png')} // Add your register image path
          style={styles.headerImage}
        />
        <Text style={styles.title}>Welcome to HealthUMediFlow</Text>
        <Text style={styles.subtitle}>
          Fill in your details to start your health journey.
        </Text>
      </View>

      {/* Form Section */}
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="First Name"
          placeholderTextColor="#999999"
          value={formData.firstName}
          onChangeText={(text) => setFormData({ ...formData, firstName: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          placeholderTextColor="#999999"
          value={formData.lastName}
          onChangeText={(text) => setFormData({ ...formData, lastName: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          placeholderTextColor="#999999"
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          placeholderTextColor="#999999"
          value={formData.password}
          onChangeText={(text) => setFormData({ ...formData, password: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          keyboardType="phone-pad"
          placeholderTextColor="#999999"
          value={formData.phoneNumber}
          onChangeText={(text) =>
            setFormData({ ...formData, phoneNumber: text })
          }
        />
        <TextInput
          style={styles.input}
          placeholder="Emergency Contact Number"
          keyboardType="phone-pad"
          placeholderTextColor="#999999"
          value={formData.emergencyContact}
          onChangeText={(text) =>
            setFormData({ ...formData, emergencyContact: text })
          }
        />
        <TextInput
          style={styles.input}
          placeholder="Country"
          placeholderTextColor="#999999"
          value={formData.country}
          onChangeText={(text) => setFormData({ ...formData, country: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Country's Emergency Number"
          keyboardType="phone-pad"
          placeholderTextColor="#999999"
          value={formData.countryEmergencyNumber}
          onChangeText={(text) =>
            setFormData({ ...formData, countryEmergencyNumber: text })
          }
        />
        <TextInput
          style={styles.input}
          placeholder="Main Doctor's Name"
          placeholderTextColor="#999999"
          value={formData.mainDoctor}
          onChangeText={(text) =>
            setFormData({ ...formData, mainDoctor: text })
          }
        />
        <TextInput
          style={styles.input}
          placeholder="Blood Type (e.g., O+)"
          placeholderTextColor="#999999"
          value={formData.bloodType}
          onChangeText={(text) => setFormData({ ...formData, bloodType: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Birthdate (DD/MM/YYYY)"
          placeholderTextColor="#999999"
          value={formData.birthdate}
          onChangeText={(text) => setFormData({ ...formData, birthdate: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Gender (e.g., Male, Female, Other)"
          placeholderTextColor="#999999"
          value={formData.gender}
          onChangeText={(text) => setFormData({ ...formData, gender: text })}
        />

        {/* Register Button */}
        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerButtonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#E8F5FF', // Soft pastel baby blue background
    padding: 20,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  headerImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3D5A80', // Deep pastel blue
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#555555', // Light gray
    textAlign: 'center',
    marginTop: 5,
  },
  form: {
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC', // Light gray border
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#FFFFFF', // White input background
    color: '#333333', // Dark text color
  },
  registerButton: {
    backgroundColor: '#FF6F61', // Vibrant coral color
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5, // Shadow for Android
    marginTop: 20,
  },
  registerButtonText: {
    color: '#FFFFFF', // White text
    fontWeight: 'bold',
    fontSize: 18,
  },
});