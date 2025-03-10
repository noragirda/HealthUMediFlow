import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import ChartSection from './chartsection';
import { LineChart } from 'react-native-chart-kit';

const tests = [
  'Glucose',
  'Lactate Dehydrogenase (LDH)',
  'High-Density Lipoprotein (HDL)',
  'Triglycerides',
  'Thyroid Stimulating Hormone (TSH)',
  'Free T4 (Thyroxine)',
  'Free T3 (Triiodothyronine)',
  'Vitamin D (25-Hydroxy)',
];

export default function ResultEvolution() {
  const [testData, setTestData] = useState<Record<string, { date: string; value: number }[]>>({});
  const [loading, setLoading] = useState(true);

  const fetchTestEvolution = async () => {
    try {
      const response = await axios.get('/api/test-evolution', {
        withCredentials: true,
      });

      const groupedData: Record<string, { date: string; value: number }[]> = {};
      tests.forEach((test) => {
        groupedData[test] = response.data.filter((item: any) => item.name === test);
      });

      setTestData(groupedData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching test evolution:', error);
      Alert.alert('Error', 'Failed to load test evolution data.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestEvolution();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading data...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Result Evolution</Text>
      {tests.map((test) => (
        <ChartSection key={test} testName={test} data={testData[test] || []} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#E8F5FF',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3D5A80',
    marginBottom: 20,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8F5FF',
  },
  loadingText: {
    fontSize: 18,
    color: '#3D5A80',
  },
});
