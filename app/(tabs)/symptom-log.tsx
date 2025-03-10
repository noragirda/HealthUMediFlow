import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
} from 'react-native';
import { logSymptom} from '../../hooks/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import axios from 'axios';

export default function SymptomLog() {
  const [symptoms, setSymptoms] = useState<{ name: string; count: number }[]>([]);
  const [newSymptom, setNewSymptom] = useState('');
  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data from AsyncStorage
  const router = useRouter();
const fetchSymptomlHistory = async () => {
  try {
    const response = await axios.get('http://192.168.1.128:5000/api/symptoms', { withCredentials: true });
    console.log('Fetched symptom history:', response.data);
    const { userId, symptoms } = response.data;
    setUserId(userId);
    setSymptoms(response.data);

  } catch (error) {
    console.error('Error fetching symptom history:', error);
    Alert.alert('Error', 'Failed to symptom history.');
  }
};
useEffect(() => {
  

  fetchSymptomlHistory();
}, []);
const logSym = async (userId: number, symptomName: string) => {
  try {
    const response = await axios.post(
      'http://192.168.1.128:5000/api/symptoms',
      { userId, symptomName }, // Ensure the correct payload is sent
      { withCredentials: true } // Include credentials for session authentication
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error logging symptom:', error.response?.data || error.message);
    } else {
      console.error('Error logging symptom:', error);
    }
    throw error;
  }
};


  // Handle adding a new symptom
  const handleAddSymptom = async () => {
    if (!newSymptom.trim()) {
      Alert.alert('Warning', 'Please enter a valid symptom.');
      return;
    }
  
    try {
      await logSym(userId!, newSymptom.trim()); // userId is now fetched from the session in the backend
      setSymptoms((prevSymptoms) => {
        const existingIndex = prevSymptoms.findIndex(
          (symptom) => symptom.name.toLowerCase() === newSymptom.toLowerCase()
        );
  
        if (existingIndex !== -1) {
          const updated = [...prevSymptoms];
          updated[existingIndex].count += 1;
          return updated;
        } else {
          return [...prevSymptoms, { name: newSymptom.trim(), count: 1 }];
        }
      });
      setNewSymptom(''); // Clear the input field
      Alert.alert('Success', 'Symptom logged successfully.');
    } catch (error) {
      console.error('Error logging symptom:', error);
      Alert.alert('Error', 'Failed to log symptom.');
    }
  };
  

  // Render each symptom
  const renderSymptom = ({ item }: { item: { name: string; count: number } }) => (
    <View style={styles.symptomRow}>
      <Image
        source={require('../../assets/images/HealthLog.png')} // Replace with your icon
        style={styles.symptomIcon}
      />
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={styles.symptomText}>{item.name}</Text>
        <Text style={styles.symptomDate}>
          Count: {item.count}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => Alert.alert('Delete', `Delete ${item.name}?`)}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
  

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/HealthLog.png')}
          style={styles.headerImage}
        />
        <Text style={styles.title}>Log Your Symptoms</Text>
        <Text style={styles.subtitle}>
          Your health matters! Keep track of your symptoms.
        </Text>
      </View>

      {/* Input Section */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter a symptom..."
          placeholderTextColor="#999999"
          value={newSymptom}
          onChangeText={setNewSymptom}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddSymptom}>
          <Text style={styles.addButtonText}>Add Symptom</Text>
        </TouchableOpacity>
      </View>

      {/* Symptoms List */}
      <FlatList
        data={symptoms}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderSymptom}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Image
              source={require('../../assets/images/ListHand.png')}
              style={styles.emptyImage}
            />
            <Text style={styles.emptyListText}>
              No symptoms logged yet. Start tracking now!
            </Text>
          </View>
        }
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5FF', // Baby blue pastel background
    padding: 20,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  headerImage: {
    width: 150,
    height: 150,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3D5A80', // Deep blue color
  },
  subtitle: {
    fontSize: 16,
    color: '#555555',
    textAlign: 'center',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#FFFFFF',
    color: '#333333',
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContainer: {
    paddingTop: 10,
  },
  symptomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  symptomIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  symptomText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3D5A80',
  },
  symptomDate: {
    fontSize: 14,
    color: '#999999',
  },
  deleteButton: {
    backgroundColor: '#FF6F61',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  symptomCount: {
    fontSize: 16,
    color: '#555555',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  emptyImage: {
    width: 120,
    height: 120,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  emptyListText: {
    fontSize: 16,
    color: '#999999',
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3D5A80',
    textAlign: 'center',
    marginTop: 50,
  },
});
