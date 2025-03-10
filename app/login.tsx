import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router'; // Import useRouter
import { loginUser } from '../hooks/api'; // Import login API function
import AsyncStorage from '@react-native-async-storage/async-storage'; // For storage

export default function LoginPage() {
  const router = useRouter(); // Initialize router
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleLogin = async () => {
    const { email, password } = formData;
  
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password!');
      return;
    }
  
    try {
      console.log('Attempting login with:', { email, password });
      const response = await loginUser({ email, password });
  
      if (response.message === 'Login successful' && response.user) {
        console.log('Login successful. Saving user data:', response.user);
  
        // Save user data in AsyncStorage
        await AsyncStorage.setItem('user', JSON.stringify(response.user));
  
        Alert.alert('Success', 'Login successful!');
        router.push('/(tabs)/home'); // Redirect to HomePage
      } else {
        console.error('Login failed. Response:', response);
        Alert.alert('Error', response.message || 'Login failed!');
      }
    } catch (error) {
      console.error('Error in handleLogin:', error);
      Alert.alert('Error', 'An error occurred during login.');
    }
  };
  
  const [isForgotPasswordVisible, setIsForgotPasswordVisible] = useState(false); // For modal visibility
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState(''); // Email for password reset
  
  const handleOpenForgotPasswordModal = () => {
    setIsForgotPasswordVisible(true); // Open the modal
  };
  
  const handleForgotPasswordSubmit = () => {
    if (!forgotPasswordEmail) {
      Alert.alert('Error', 'Please enter your email!');
      return;
    }
  
    // Display a success message
    Alert.alert('Success', `An email will be sent to ${forgotPasswordEmail} to reset your password.`);
    setIsForgotPasswordVisible(false); // Close the modal
    setForgotPasswordEmail(''); // Clear the input
  };
  

  const handleRegister = () => {
    router.push('/register');
  };

  return (
    <View style={styles.container}>
      {/* Gradient Background */}
      <View style={styles.gradientBackground} />

      {/* Logo at the top */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/images/logo.png')} // Update this to your actual logo path
          style={styles.logo}
        />
      </View>

      {/* Login Message */}
      <Text style={styles.title}>Login to Your Account</Text>

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        placeholderTextColor="#999999"
        value={formData.email}
        onChangeText={(text) => setFormData({ ...formData, email: text })}
      />

      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        placeholderTextColor="#999999"
        value={formData.password}
        onChangeText={(text) => setFormData({ ...formData, password: text })}
      />

      {/* Login Button */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      {/* Register Section */}
      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>Don't have an account?</Text>
        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerButtonText}>Register here!</Text>
        </TouchableOpacity>
      </View>
       {/* Forgot Password Link */}
<TouchableOpacity onPress={handleOpenForgotPasswordModal}>
  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
</TouchableOpacity>

{/* Forgot Password Modal */}
<Modal
  visible={isForgotPasswordVisible}
  animationType="slide"
  transparent
  onRequestClose={() => setIsForgotPasswordVisible(false)}
>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Forgot Password</Text>
      <Text style={styles.modalMessage}>
        Please enter your email address to reset your password.
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        keyboardType="email-address"
        placeholderTextColor="#999999"
        value={forgotPasswordEmail}
        onChangeText={setForgotPasswordEmail}
      />
      <View style={styles.modalButtons}>
        <TouchableOpacity
          style={[styles.modalButton, styles.cancelButton]}
          onPress={() => setIsForgotPasswordVisible(false)}
        >
          <Text style={styles.modalButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modalButton, styles.submitButton]}
          onPress={handleForgotPasswordSubmit}
        >
          <Text style={styles.modalButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>

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
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'linear-gradient(180deg, #A8E6CF, #E8F5FF)',
  },
  logoContainer: {
    backgroundColor: '#FFE6E6', // Pastel pink background for logo container
    padding: 30,
    borderRadius: 150, // Circular effect around the logo
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6, // Shadow for Android
  },
  logo: {
    width: 200, // Larger logo width
    height: 200, // Larger logo height
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#3D5A80', // Deep pastel blue for text
    marginBottom: 30,
  },
  input: {
    width: '85%',
    height: 50,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    color: '#333333',
  },
  loginButton: {
    backgroundColor: '#FF6F61', // Vibrant coral color for the button
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6, // Shadow for Android
  },
  loginButtonText: {
    color: '#FFFFFF', // White text
    fontWeight: 'bold',
    fontSize: 18,
  },
  forgotPasswordText: {
    marginTop: 15,
    fontSize: 16,
    color: '#007BFF', // Blue link color
    textDecorationLine: 'underline',
  },
  registerContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  registerText: {
    fontSize: 16,
    color: '#555555',
    marginBottom: 10,
  },
  registerButton: {
    backgroundColor: '#FFD3B6', // Pastel orange background
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  registerButtonText: {
    color: '#2C3E50', // Deep blue-gray for contrast
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3D5A80',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 14,
    color: '#555555',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#CCCCCC',
  },
  submitButton: {
    backgroundColor: '#FF6F61',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});