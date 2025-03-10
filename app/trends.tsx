import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Alert,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_BASE_URL from '../constants/apiConfig'; // Update the path as needed

const screenWidth = Dimensions.get('window').width;

export default function TrendsPage() {
  const [sleepData, setSleepData] = useState<{ date: string; value: number }[]>([]);
  const [stepsData, setStepsData] = useState<{ date: string; value: number }[]>([]);
  const [inputSleepHours, setInputSleepHours] = useState('');
  const [inputSteps, setInputSteps] = useState('');

  const fetchTrends = async () => {
    try {
      const userString = await AsyncStorage.getItem('user');
      const user = userString ? JSON.parse(userString) : null;
      const token = await AsyncStorage.getItem('authToken');
  
      const response = await fetch(`${API_BASE_URL}/trends?userId=${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch trends data');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching trends:', error);
      Alert.alert('Error', 'Unable to fetch trends data.');
      return [];
    }
  };
  

  const handleAddSleepData = () => {
    const sleepHours = parseFloat(inputSleepHours);
    if (!isNaN(sleepHours)) {
      const date = new Date().toLocaleDateString();
      setSleepData([...sleepData, { date, value: sleepHours }]);
      setInputSleepHours('');
    } else {
      Alert.alert('Invalid Input', 'Please enter a valid number of sleep hours.');
    }
  };

  const handleAddStepsData = () => {
    const steps = parseInt(inputSteps, 10);
    if (!isNaN(steps)) {
      const date = new Date().toLocaleDateString();
      setStepsData([...stepsData, { date, value: steps }]);
      setInputSteps('');
    } else {
      Alert.alert('Invalid Input', 'Please enter a valid number of steps.');
    }
  };

interface DataEntry {
    date: string;
    value: number;
}

interface ChartData {
    labels: string[];
    datasets: {
        data: number[];
        strokeWidth: number;
    }[];
}

const prepareChartData = (data: DataEntry[]): ChartData => {
    return {
        labels: data.map((entry) => entry.date),
        datasets: [
            {
                data: data.map((entry) => entry.value),
                strokeWidth: 2, // Optional for custom line thickness
            },
        ],
    };
};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Health Trends</Text>
        <Text style={styles.subtitle}>Track your health metrics over time</Text>
      </View>

      {/* Sleep Data Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sleep Hours</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter hours of sleep"
          keyboardType="numeric"
          value={inputSleepHours}
          onChangeText={setInputSleepHours}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddSleepData}>
          <Text style={styles.addButtonText}>Add Sleep Data</Text>
        </TouchableOpacity>
        {sleepData.length > 0 && (
          <LineChart
            data={prepareChartData(sleepData)}
            width={screenWidth - 40}
            height={220}
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#A8E6CF',
              backgroundGradientTo: '#A8E6CF',
              decimalPlaces: 1,
              color: (opacity = 1) => `rgba(61, 90, 128, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(61, 90, 128, ${opacity})`,
              style: { borderRadius: 16 },
            }}
            style={styles.chart}
          />
        )}
      </View>

      {/* Steps Data Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Daily Steps</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter number of steps"
          keyboardType="numeric"
          value={inputSteps}
          onChangeText={setInputSteps}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddStepsData}>
          <Text style={styles.addButtonText}>Add Steps Data</Text>
        </TouchableOpacity>
        {stepsData.length > 0 && (
          <LineChart
            data={prepareChartData(stepsData)}
            width={screenWidth - 40}
            height={220}
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#FFB6C1',
              backgroundGradientTo: '#FFB6C1',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(61, 90, 128, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(61, 90, 128, ${opacity})`,
              style: { borderRadius: 16 },
            }}
            style={styles.chart}
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#E8F5FF', // Baby blue pastel background
    padding: 20,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3D5A80', // Deep pastel blue
  },
  subtitle: {
    fontSize: 16,
    color: '#555555', // Light gray
    marginTop: 5,
    textAlign: 'center',
  },
  section: {
    marginBottom: 30,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3D5A80', // Deep pastel blue
    marginBottom: 10,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#F9F9F9',
    color: '#333333',
  },
  addButton: {
    backgroundColor: '#FF6F61',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  chart: {
    marginTop: 20,
    borderRadius: 16,
  },
});
