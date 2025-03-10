import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

interface ChartSectionProps {
  testName: string;
  data: { date: string; value: number }[];
}

const ChartSection: React.FC<ChartSectionProps> = ({ testName, data }) => {
  if (data.length === 0) {
    return (
      <View style={styles.chartContainer}>
        <Text style={styles.testName}>{testName}</Text>
        <Text style={styles.noDataText}>No data available for this test.</Text>
      </View>
    );
  }

  const chartData = {
    labels: data.map((item) => new Date(item.date).toLocaleDateString()),
    datasets: [
      {
        data: data.map((item) => item.value),
      },
    ],
  };

  return (
    <View style={styles.chartContainer}>
      <Text style={styles.testName}>{testName}</Text>
      <LineChart
        data={chartData}
        width={Dimensions.get('window').width - 40} // Adjust width
        height={220}
        chartConfig={{
          backgroundColor: '#E8F5FF',
          backgroundGradientFrom: '#E8F5FF',
          backgroundGradientTo: '#E8F5FF',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(61, 90, 128, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(61, 90, 128, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#3D5A80',
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    marginBottom: 30,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  testName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3D5A80',
    marginBottom: 10,
  },
  noDataText: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
  },
});

export default ChartSection;
