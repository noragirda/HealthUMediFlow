import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  PanResponder,
  Linking,
  Alert,
} from 'react-native';
import axios from 'axios';

export default function FloatingBubble() 
{
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [emergencyContact, setEmergencyContact] = useState('112');
  useEffect(() => {
    const fetchEmergencyContact = async () => {
      try {
        const response = await axios.get('http://172.20.10.9:5000/api/emergency-contact', {
          withCredentials: true,
        });
        setEmergencyContact(response.data.emergencyContact);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          console.warn('User not authenticated, defaulting to 112.');
        } else {
          if (error instanceof Error) {
            console.error('Error fetching emergency contact:', error.message);
          } else {
            console.error('Error fetching emergency contact:', error);
          }
          Alert.alert('Error', 'Failed to fetch emergency contact. Defaulting to 112.');
        }
      }
    };

    fetchEmergencyContact();
  }, []);
  
  
  
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gestureState) => {
      setPosition({
        x: gestureState.moveX - 25,
        y: gestureState.moveY - 25,
      });
    },
  });

  const handlePress = () => {
    Linking.openURL(`tel:${emergencyContact}`);
  };

  return (
    <View
      {...panResponder.panHandlers}
      style={[
        styles.bubble,
        { left: position.x, top: position.y },
      ]}
    >
      <TouchableOpacity onPress={handlePress} style={styles.touchable}>
        <Text style={styles.text}>SOS</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FF4D4D', // Vibrant red color
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100, // Ensure it appears above other elements
    elevation: 10,
  },
  touchable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
