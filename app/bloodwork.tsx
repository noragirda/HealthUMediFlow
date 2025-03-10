import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { fetchTestTypes, fetchTestNames, submitTestResults } from '../hooks/api';

export default function BloodWorks() {
  // State for selected test type
  const [testType, setTestType] = useState('Blood Work');
  const [testTypes, setTestTypes] = useState([]);
  interface TestName {
    id: string;
    name: string;
    unit: string;
    min_value: number;
    max_value: number;
  }

  interface FormData {
    id: string;
    name: string;
    value: string;
    unit: string;
    min: number;
    max: number;
    notes: string;
  }

  const [testNames, setTestNames] = useState<TestName[]>([]);
  const [formData, setFormData] = useState<FormData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch test types from the server
  useEffect(() => {
    const fetchTestTypes = async () => {
        try {
          console.log('Fetching test types...');
          const response = await axios.get('http://172.20.10.9:5000/api/test-types');
          console.log('Test types response:', response.data);
          setTestTypes(response.data);
        } catch (error) {
          console.error('Error fetching test types:', error);
        }
      };
      
    fetchTestTypes();
  }, []);

  // Fetch test names when test type changes
  useEffect(() => {
    const fetchTestNames = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`http://172.20.10.9:5000/api/test-names?type=${testType}`);
        setTestNames(response.data); // Response should be an array of test names with their details
      } catch (error) {
        console.error('Error fetching test names:', error);
        Alert.alert('Error', 'Failed to load test names.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTestNames();
  }, [testType]);

  // Initialize form data when test names are loaded
  useEffect(() => {
    const initialFormData = testNames.map((test) => ({
      id: test.id,
      name: test.name,
      value: '',
      unit: test.unit,
      min: test.min_value,
      max: test.max_value,
      notes: '',
    }));
    setFormData(initialFormData);
  }, [testNames]);

  // Handle input changes for test results
const handleInputChange = (index: number, field: keyof FormData, value: string) => {
    const updatedFormData: FormData[] = [...formData];
    updatedFormData[index] = {
        ...updatedFormData[index],
        [field]: value,
    };
    setFormData(updatedFormData);
};

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const results = formData.filter((test) => test.value); // Only submit filled tests
      if (results.length === 0) {
        Alert.alert('No Data', 'Please fill in at least one test result.');
        return;
      }

      await Promise.all(
        results.map((test) =>
          axios.post('http://172.20.10.9:5000/api/lab-tests', {
            test_name_id: test.id,
            value: parseFloat(test.value),
            date: new Date().toISOString().split('T')[0], // Current date
            notes: test.notes,
          })
        )
      );

      Alert.alert('Success', 'Test results added successfully!');
    } catch (error) {
      console.error('Error submitting test results:', error);
      Alert.alert('Error', 'Failed to add test results.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add Your Test Results</Text>

      {/* Select Test Type */}
      <Text style={styles.label}>Select Test Type:</Text>
      <Picker
        selectedValue={testType}
        onValueChange={(itemValue) => setTestType(itemValue)}
        style={styles.picker}
      >
        {testTypes.map((type, index) => (
          <Picker.Item key={index} label={type} value={type} />
        ))}
      </Picker>

      {/* Test Form */}
      {isLoading ? (
        <ActivityIndicator size="large" color="#3D5A80" />
      ) : (
        formData.map((test, index) => (
          <View key={test.id} style={styles.testRow}>
            <Text style={styles.testName}>{test.name}</Text>
            <Text style={styles.referenceRange}>
              Normal: {test.min} - {test.max} {test.unit}
            </Text>
            <TextInput
              style={styles.input}
              placeholder={`Enter value (${test.unit})`}
              keyboardType="numeric"
              value={test.value}
              onChangeText={(value) => handleInputChange(index, 'value', value)}
            />
            <TextInput
              style={styles.notesInput}
              placeholder="Notes (Optional)"
              value={test.notes}
              onChangeText={(value) => handleInputChange(index, 'notes', value)}
            />
          </View>
        ))
      )}

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Save Results</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#E8F5FF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3D5A80',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  picker: {
    marginBottom: 20,
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 10,
  },
  testRow: {
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  testName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3D5A80',
  },
  referenceRange: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
