import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../../constants/apiConfig';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import axios from 'axios';

export default function AppointmentsPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [appointmentDetails, setAppointmentDetails] = useState({
    time: '',
    place: '',
    type: '',
    doctor: '',
    specialty: '',
  });

  interface Appointment {
    id: number;
    date: string;
    time: string;
    place: string;
    type: string;
    doctor: string;
    specialty: string;
  }

  // Fetch appointments when the component loads
  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get('${API_BASE_URL}/api/appointments', {
        withCredentials: true,
      });
      setAppointments(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error fetching appointments:', error.response?.data || error.message);
      } else {
        console.error('Error fetching appointments:', error);
      }
      Alert.alert('Error', 'Failed to fetch appointments.');
    }
  };

  const addAppointment = async () => {
    const { time, place, type, doctor, specialty } = appointmentDetails;
    if (!time || !place || !type || !doctor || !specialty) {
      Alert.alert('Warning', 'Please fill in all fields.');
      return;
    }

    try {
      await axios.post(
        '${API_BASE_URL}/api/appointments',
        {
          appointment_date: selectedDate.toISOString(),
          time,
          place,
          type,
          doctor,
          specialty,
        },
        { withCredentials: true }
      );
      Alert.alert('Success', 'Appointment added successfully.');
      fetchAppointments(); // Refresh the list
      setAppointmentDetails({
        time: '',
        place: '',
        type: '',
        doctor: '',
        specialty: '',
      }); // Clear form
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error adding appointment:', error.response?.data || error.message);
      } else {
        console.error('Error adding appointment:', error);
      }
      Alert.alert('Error', 'Failed to add appointment.');
    }
  };

  const handleDateChange = (event: DateTimePickerEvent, date?: Date | undefined): void => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  const renderAppointment = ({ item }: { item: Appointment }) => (
    <View style={styles.appointmentRow}>
      <Text style={styles.appointmentText}>
        <Text style={styles.boldText}>Date:</Text> {item.date}
      </Text>
      <Text style={styles.appointmentText}>
        <Text style={styles.boldText}>Time:</Text> {item.time}
      </Text>
      <Text style={styles.appointmentText}>
        <Text style={styles.boldText}>Place:</Text> {item.place}
      </Text>
      <Text style={styles.appointmentText}>
        <Text style={styles.boldText}>Type:</Text> {item.type}
      </Text>
      <Text style={styles.appointmentText}>
        <Text style={styles.boldText}>Doctor:</Text> {item.doctor}
      </Text>
      <Text style={styles.appointmentText}>
        <Text style={styles.boldText}>Specialty:</Text> {item.specialty}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/doctorsApp.png')}
          style={styles.headerImage}
        />
        <Text style={styles.title}>Don't miss your appointment!</Text>
      </View>

      {/* Date Picker */}
      <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
        <Text style={styles.dateButtonText}>
          Select Date: {selectedDate.toLocaleDateString()}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      {/* Appointment Form */}
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Time (e.g., 10:00 AM)"
          placeholderTextColor="#999999"
          value={appointmentDetails.time}
          onChangeText={(text) => setAppointmentDetails({ ...appointmentDetails, time: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Place (e.g., Clinic Name)"
          placeholderTextColor="#999999"
          value={appointmentDetails.place}
          onChangeText={(text) => setAppointmentDetails({ ...appointmentDetails, place: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Type of Consultation (e.g., General Checkup)"
          placeholderTextColor="#999999"
          value={appointmentDetails.type}
          onChangeText={(text) => setAppointmentDetails({ ...appointmentDetails, type: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Doctor's Name"
          placeholderTextColor="#999999"
          value={appointmentDetails.doctor}
          onChangeText={(text) => setAppointmentDetails({ ...appointmentDetails, doctor: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Specialty (e.g., Cardiologist)"
          placeholderTextColor="#999999"
          value={appointmentDetails.specialty}
          onChangeText={(text) =>
            setAppointmentDetails({ ...appointmentDetails, specialty: text })
          }
        />
        <TouchableOpacity style={styles.addButton} onPress={addAppointment}>
          <Text style={styles.addButtonText}>Add Appointment</Text>
        </TouchableOpacity>
      </View>

      {/* Appointment List */}
      <FlatList
        data={appointments}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderAppointment}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyListText}>No appointments yet. Start scheduling!</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5FF',
    padding: 20,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  headerImage: {
    width: 120,
    height: 120,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3D5A80',
    textAlign: 'center',
  },
  dateButton: {
    backgroundColor: '#FF6F61',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 15,
  },
  dateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  form: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
    color: '#333333',
  },
  addButton: {
    backgroundColor: '#FF6F61',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
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
  appointmentRow: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  appointmentText: {
    fontSize: 14,
    color: '#3D5A80',
  },
  boldText: {
    fontWeight: 'bold',
  },
  emptyListText: {
    fontSize: 16,
    color: '#999999',
    textAlign: 'center',
    marginTop: 20,
  },
});
