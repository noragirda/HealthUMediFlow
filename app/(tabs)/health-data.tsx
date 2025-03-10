import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import API_BASE_URL from '../../constants/apiConfig';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { uploadFile } from '../../hooks/api';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

export default function HealthDataTab() {

interface CustomFile {
  uri: string;
  name: string;
  type: string;
}
// Define the CustomFile type
const router = useRouter();
const [medicalHistory, setMedicalHistory] = useState([]);
const fetchMedicalHistory = async () => {
  try {
    const response = await axios.get('/api/medical-history', { withCredentials: true });
    console.log('Fetched medical history:', response.data);
    setMedicalHistory(response.data);
    const filteredResults = response.data.filter(
      (item: { type: string }) =>
        item.type === 'Blood Work' || item.type === 'Urine' || item.type === 'Allergy'
    );
    setBloodWorkResults(filteredResults);
    const allergyData = response.data.filter((item: { type: string }) => item.type === 'Allergy');
    setAllergyList(allergyData);

    const treatmentData = response.data.filter((item: { type: string }) => item.type === 'Treatment');
    setTreatmentList(treatmentData);
    const diagnosisData = response.data.filter((item: { type: string }) => item.type === 'Diagnosis');
    setDiagnosisList(diagnosisData);
    const vaccinationData = response.data.filter((item: { type: string }) => item.type === 'Vaccination');
    setVaccinationList(vaccinationData);
    const bloodTypeData = response.data.find((item: { type: string }) => item.type === 'Blood Type');
    setBloodType(bloodTypeData?.details || null);
    const interventionData = response.data.filter((item: { type: string }) => item.type === 'Intervention');
    setInterventionList(interventionData);
    const doctorData = response.data.filter((item: { type: string }) => item.type === 'Doctors');
    setDoctorList(doctorData);

  } catch (error) {
    console.error('Error fetching medical history:', error);
    Alert.alert('Error', 'Failed to fetch medical history.');
  }
};
useEffect(() => {
  

  fetchMedicalHistory();
}, []);
// allergies
const [allergy, setAllergy] = useState('');
const [allergyList, setAllergyList] = useState([]);

interface Allergy {
  id: string;
  details: string;
  uploaded_date: string;
}

const addAllergy = async (details: string): Promise<void> => {
  try {
    await axios.post(
      '${API_BASE_URL}/api/medical-history',
      { type: 'Allergy', details },
      { withCredentials: true }
    );
    Alert.alert('Success', 'Allergy added successfully!');
    fetchMedicalHistory(); // Refresh the medical history data
  } catch (error) {
    console.error('Error adding allergy:', error);
    Alert.alert('Error', 'Failed to add allergy.');
  }
};
//treatment
const [treatmentList, setTreatmentList] = useState([]);
const [newTreatment, setNewTreatment] = useState('');
const [isTreatmentModalVisible, setTreatmentModalVisible] = useState(false);

const addTreatment = async (details: string): Promise<void> => {
  try {
    await axios.post(
      'http://172.20.10.9:5000/api/medical-history',
      { type: 'Treatment', details },
      { withCredentials: true }
    );
    Alert.alert('Success', 'Treatment added successfully!');
    fetchMedicalHistory(); // Refresh the medical history data
  } catch (error) {
    console.error('Error adding treatment:', error);
    Alert.alert('Error', 'Failed to add treatment.');
  }
};
//diagnosisi
const [diagnosisList, setDiagnosisList] = useState([]);
const [newDiagnosis, setNewDiagnosis] = useState('');
const [isDiagnosisModalVisible, setDiagnosisModalVisible] = useState(false);

const addDiagnosis = async (details: string): Promise<void> => {
  try {
    await axios.post(
      'http://172.20.10.9:5000/api/medical-history',
      { type: 'Diagnosis', details },
      { withCredentials: true }
    );
    Alert.alert('Success', 'Diagnosis added successfully!');
    fetchMedicalHistory(); // Refresh the medical history data
  } catch (error) {
    console.error('Error adding diagnosis:', error);
    Alert.alert('Error', 'Failed to add diagnosis.');
  }
};
//vaccinations
const [vaccinationList, setVaccinationList] = useState([]);
const [newVaccination, setNewVaccination] = useState('');
const [isVaccinationModalVisible, setVaccinationModalVisible] = useState(false);

const addVaccination = async (details: string): Promise<void> => {
  try {
    await axios.post(
      'http://172.20.10.9:5000/api/medical-history',
      { type: 'Vaccination', details },
      { withCredentials: true }
    );
    Alert.alert('Success', 'Vaccination added successfully!');
    fetchMedicalHistory(); // Refresh the medical history data
  } catch (error) {
    console.error('Error adding vaccination:', error);
    Alert.alert('Error', 'Failed to add vaccination.');
  }
};
// Blood Type State and Functions
const [bloodType, setBloodType] = useState<string | null>(null);
const [isEditingBloodType, setIsEditingBloodType] = useState(false);
const [newBloodType, setNewBloodType] = useState('');
const [isBloodTypeModalVisible, setBloodTypeModalVisible] = useState(false);

// Function to Add Blood Type
const addBloodType = async (details: string): Promise<void> => {
  if (!/^[ABO][+-]$/.test(details)) {
    Alert.alert('Error', 'Please enter a valid blood type (e.g., A+, O-).');
    return;
  }
  try {
    await axios.post(
      'http://172.20.10.9:5000/api/medical-history',
      { type: 'Blood Work', details },
      { withCredentials: true }
    );
    Alert.alert('Success', 'Blood type added successfully!');
    setBloodType(details); // Save the blood type locally
    setBloodTypeModalVisible(false);
    setNewBloodType('');
  } catch (error) {
    console.error('Error adding blood type:', error);
    Alert.alert('Error', 'Failed to add blood type.');
  }
};
//interventions
// Interventions & Hospitalizations
const [interventionList, setInterventionList] = useState([]);
const [newIntervention, setNewIntervention] = useState('');
const [isInterventionModalVisible, setInterventionModalVisible] = useState(false);

const addIntervention = async (details: string): Promise<void> => {
  try {
    await axios.post(
      'http://172.20.10.9:5000/api/medical-history',
      { type: 'Interventions', details },
      { withCredentials: true }
    );
    Alert.alert('Success', 'Intervention added successfully!');
    fetchMedicalHistory(); // Refresh the medical history data
  } catch (error) {
    console.error('Error adding intervention:', error);
    Alert.alert('Error', 'Failed to add intervention.');
  }
};
const [doctorList, setDoctorList] = useState([]);
const [newDoctor, setNewDoctor] = useState('');
const [isDoctorModalVisible, setDoctorModalVisible] = useState(false);

const addDoctor = async (details: string): Promise<void> => {
  try {
    await axios.post(
      'http://172.20.10.9:5000/api/medical-history',
      { type: 'Doctors', details },
      { withCredentials: true }
    );
    Alert.alert('Success', 'Doctor added successfully!');
    fetchMedicalHistory(); // Refresh the medical history data
  } catch (error) {
    console.error('Error adding Doctor:', error);
    Alert.alert('Error', 'Failed to add doctor.');
  }
};

const [bloodWorkResults, setBloodWorkResults] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  function setModalVisible(visible: boolean): void {
    setIsModalVisible(visible);
  }

  const [newAllergy, setNewAllergy] = useState('');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Title Section */}
      <View style={styles.header}>
        <Text style={styles.title}>Your Medical History</Text>
        <Text style={styles.subtitle}>Organized and accessible in one place</Text>
      </View>

      {/* Blood Work Section */}
      <View style={styles.section}>
        <Image
          source={require('../../assets/images/bloodWork.png')}
          style={styles.sectionImage}
        />
        <Text style={styles.sectionTitle}>Blood Work and Tests</Text>
        <Text style={styles.sectionSubtitle}>
          Introduce and view your blood work reports
        </Text>
        <TouchableOpacity style={styles.uploadButton} onPress={() => router.push('../bloodwork')}>
          <Text style={styles.uploadButtonText}>Introduce Your Results</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.uploadButton} onPress={() => router.push('../result-evolution')}>
          <Text style={styles.uploadButtonText}>See the Result Evolution</Text>
        </TouchableOpacity>
      </View>

      {/* Allergies Section */}
<View style={styles.section}>
  <Image
    source={require('../../assets/images/allergies.png')}
    style={styles.sectionImage}
  />
  <Text style={styles.sectionTitle}>Allergies</Text>
  <Text style={styles.sectionSubtitle}>
    View and manage your recorded allergies.
  </Text>

  {/* Display allergies in a neatly styled list */}
  <View style={styles.allergyList}>
    {allergyList.length === 0 ? (
      <Text style={styles.allergyText}>No allergies recorded yet.</Text>
    ) : (
      allergyList.map((item: Allergy) => (
        <View key={item.id} style={styles.allergyItem}>
          <Text style={styles.allergyText}>
            {item.details}
          </Text>
          <Text style={styles.allergyDate}>
            Added on {new Date(item.uploaded_date).toLocaleDateString()}
          </Text>
        </View>
      ))
    )}
  </View>

  {/* Add Allergy Button */}
  <TouchableOpacity
    style={styles.addButton}
    onPress={() => setModalVisible(true)} // Show the modal when button is pressed
  >
    <Text style={styles.addButtonText}>Add Allergy</Text>
  </TouchableOpacity>

  {/* Modal for Adding Allergy */}
  {isModalVisible && (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Add Allergy</Text>
        <TextInput
          style={styles.modalInput}
          placeholder="Enter allergy details"
          placeholderTextColor="#999"
          value={newAllergy}
          onChangeText={setNewAllergy}
        />
        <View style={styles.modalButtons}>
          <TouchableOpacity
            style={[styles.modalButton, { backgroundColor: '#ccc' }]}
            onPress={() => setModalVisible(false)} // Close the modal
          >
            <Text style={styles.modalButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={async () => {
              if (newAllergy.trim() !== '') {
                await addAllergy(newAllergy.trim());
                setNewAllergy('');
                setModalVisible(false); // Close the modal after adding
              } else {
                Alert.alert('Error', 'Please enter valid allergy details.');
              }
            }}
          >
            <Text style={styles.modalButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )}
</View>



      {/* Treatments Section */}
      <View style={styles.section}>
  <Image
    source={require('../../assets/images/Treatments.png')}
    style={styles.sectionImage}
  />
  <Text style={styles.sectionTitle}>Treatments</Text>
  <Text style={styles.sectionSubtitle}>
    View and manage your recorded treatments.
  </Text>

  {/* Display treatments in a styled list */}
  <View style={styles.treatmentList}>
    {treatmentList.length === 0 ? (
      <Text style={styles.filePreviewText}>No treatments recorded yet.</Text>
    ) : (
      treatmentList.map((item: { id: string; details: string; uploaded_date: string }) => (
        <View key={item.id} style={styles.allergyItem}>
          <Text style={styles.allergyText}>{item.details}</Text>
          <Text style={styles.allergyDate}>
            Added on {new Date(item.uploaded_date).toLocaleDateString()}
          </Text>
        </View>
      ))
    )}
  </View>

  {/* Add Treatment Button */}
  <TouchableOpacity
    style={styles.addButton}
    onPress={() => setTreatmentModalVisible(true)} // Show the modal when button is pressed
  >
    <Text style={styles.addButtonText}>Add Treatment</Text>
  </TouchableOpacity>

  {/* Modal for Adding Treatment */}
  {isTreatmentModalVisible && (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Add Treatment</Text>
        <TextInput
          style={styles.modalInput}
          placeholder="Enter treatment details"
          placeholderTextColor="#999"
          value={newTreatment}
          onChangeText={setNewTreatment}
        />
        <View style={styles.modalButtons}>
          <TouchableOpacity
            style={[styles.modalButton, { backgroundColor: '#ccc' }]}
            onPress={() => setTreatmentModalVisible(false)} // Close the modal
          >
            <Text style={styles.modalButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={async () => {
              if (newTreatment.trim() !== '') {
                await addTreatment(newTreatment.trim());
                setNewTreatment('');
                setTreatmentModalVisible(false); // Close the modal after adding
              } else {
                Alert.alert('Error', 'Please enter valid treatment details.');
              }
            }}
          >
            <Text style={styles.modalButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )}
</View>


      {/* Diagnosis Section */}
      <View style={styles.section}>
  <Image
    source={require('../../assets/images/Diagnosis.png')}
    style={styles.sectionImage}
  />
  <Text style={styles.sectionTitle}>Diagnosis</Text>
  <Text style={styles.sectionSubtitle}>
    View and manage your recorded diagnoses.
  </Text>

  {/* Display diagnoses in a styled list */}
  <View style={styles.diagnosisList}>
    {diagnosisList.length === 0 ? (
      <Text style={styles.filePreviewText}>No diagnoses recorded yet.</Text>
    ) : (
      diagnosisList.map((item: { id: string; details: string; uploaded_date: string }) => (
        <View key={item.id} style={styles.allergyItem}>
          <Text style={styles.allergyText}>{item.details}</Text>
          <Text style={styles.allergyDate}>
            Added on {new Date(item.uploaded_date).toLocaleDateString()}
          </Text>
        </View>
      ))
    )}
  </View>

  {/* Add Diagnosis Button */}
  <TouchableOpacity
    style={styles.addButton}
    onPress={() => setDiagnosisModalVisible(true)} // Show the modal when button is pressed
  >
    <Text style={styles.addButtonText}>Add Diagnosis</Text>
  </TouchableOpacity>

  {/* Modal for Adding Diagnosis */}
  {isDiagnosisModalVisible && (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Add Diagnosis</Text>
        <TextInput
          style={styles.modalInput}
          placeholder="Enter diagnosis details"
          placeholderTextColor="#999"
          value={newDiagnosis}
          onChangeText={setNewDiagnosis}
        />
        <View style={styles.modalButtons}>
          <TouchableOpacity
            style={[styles.modalButton, { backgroundColor: '#ccc' }]}
            onPress={() => setDiagnosisModalVisible(false)} // Close the modal
          >
            <Text style={styles.modalButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={async () => {
              if (newDiagnosis.trim() !== '') {
                await addDiagnosis(newDiagnosis.trim());
                setNewDiagnosis('');
                setDiagnosisModalVisible(false); // Close the modal after adding
              } else {
                Alert.alert('Error', 'Please enter valid diagnosis details.');
              }
            }}
          >
            <Text style={styles.modalButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )}
</View>


      {/* Vaccinations Section */}
      <View style={styles.section}>
  <Image
    source={require('../../assets/images/vaccine.png')}
    style={styles.sectionImage}
  />
  <Text style={styles.sectionTitle}>Vaccinations</Text>
  <Text style={styles.sectionSubtitle}>
    View and manage your recorded vaccinations.
  </Text>

  {/* Display vaccinations in a styled list */}
  <View style={styles.vaccineList}>
    {vaccinationList.length === 0 ? (
      <Text style={styles.filePreviewText}>No vaccination records yet.</Text>
    ) : (
      vaccinationList.map((item: { id: string; details: string; uploaded_date: string }) => (
        <View key={item.id} style={styles.allergyItem}>
          <Text style={styles.allergyText}>{item.details}</Text>
          <Text style={styles.allergyDate}>
            Added on {new Date(item.uploaded_date).toLocaleDateString()}
          </Text>
        </View>
      ))
    )}
  </View>

  {/* Add Vaccination Button */}
  <TouchableOpacity
    style={styles.addButton}
    onPress={() => setVaccinationModalVisible(true)} // Show the modal when button is pressed
  >
    <Text style={styles.addButtonText}>Add Vaccination</Text>
  </TouchableOpacity>

  {/* Modal for Adding Vaccination */}
  {isVaccinationModalVisible && (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Add Vaccination</Text>
        <TextInput
          style={styles.modalInput}
          placeholder="Enter vaccination details"
          placeholderTextColor="#999"
          value={newVaccination}
          onChangeText={setNewVaccination}
        />
        <View style={styles.modalButtons}>
          <TouchableOpacity
            style={[styles.modalButton, { backgroundColor: '#ccc' }]}
            onPress={() => setVaccinationModalVisible(false)} // Close the modal
          >
            <Text style={styles.modalButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={async () => {
              if (newVaccination.trim() !== '') {
                await addVaccination(newVaccination.trim());
                setNewVaccination('');
                setVaccinationModalVisible(false); // Close the modal after adding
              } else {
                Alert.alert('Error', 'Please enter valid vaccination details.');
              }
            }}
          >
            <Text style={styles.modalButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )}
</View>

   {/* Blood Type Section */}
<View style={styles.section}>
  <Image
    source={require('../../assets/images/bloodType.png')}
    style={styles.sectionImage}
  />
  <Text style={styles.sectionTitle}>Blood Type</Text>
  <Text style={styles.sectionSubtitle}>
    Record your blood type information.
  </Text>

  {bloodType ? (
    <View>
      <Text style={styles.bloodTypeText}>Your Blood Type: {bloodType}</Text>
    </View>
  ) : (
    <View>
      <Text style={styles.bloodTypeText}>No blood type recorded yet.</Text>
      {/* Add Blood Type Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setBloodTypeModalVisible(true)} // Open modal to add blood type
      >
        <Text style={styles.addButtonText}>Add Blood Type</Text>
      </TouchableOpacity>
    </View>
  )}

  {/* Modal for Adding Blood Type */}
  {isBloodTypeModalVisible && (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Add Blood Type</Text>
        <TextInput
          style={styles.modalInput}
          placeholder="Enter your blood type (e.g., O+)"
          placeholderTextColor="#999"
          value={newBloodType}
          onChangeText={(text) => setNewBloodType(text.toUpperCase())} // Automatically uppercase
        />
        <View style={styles.modalButtons}>
          <TouchableOpacity
            style={[styles.modalButton, { backgroundColor: '#ccc' }]}
            onPress={() => setBloodTypeModalVisible(false)} // Close the modal
          >
            <Text style={styles.modalButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={async () => {
              if (/^[ABO][+-]$/.test(newBloodType)) {
                await addBloodType(newBloodType.trim());
                setBloodTypeModalVisible(false); // Close modal after saving
                setNewBloodType(''); // Clear the input
              } else {
                Alert.alert(
                  'Error',
                  'Please enter a valid blood type (e.g., A+, O-).'
                );
              }
            }}
          >
            <Text style={styles.modalButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )}
</View>


     {/* Interventions & Hospitalizations Section */}
<View style={styles.section}>
  <Image
    source={require('../../assets/images/hospitalization.png')}
    style={styles.sectionImage}
  />
  <Text style={styles.sectionTitle}>Interventions & Hospitalizations</Text>
  <Text style={styles.sectionSubtitle}>
    Record major medical interventions or hospitalizations.
  </Text>

  {/* Display interventions in a styled list */}
  <View style={styles.interventionList}>
    {interventionList.length === 0 ? (
      <Text style={styles.filePreviewText}>No interventions or hospitalizations recorded yet.</Text>
    ) : (
      interventionList.map((item: { id: string; details: string; uploaded_date: string }) => (
        <View key={item.id} style={styles.allergyItem}>
          <Text style={styles.allergyText}>{item.details}</Text>
          <Text style={styles.allergyDate}>
            Added on {new Date(item.uploaded_date).toLocaleDateString()}
          </Text>
        </View>
      ))
    )}
  </View>

  {/* Add Intervention Button */}
  <TouchableOpacity
    style={styles.addButton}
    onPress={() => setInterventionModalVisible(true)} // Show the modal when button is pressed
  >
    <Text style={styles.addButtonText}>Add Intervention</Text>
  </TouchableOpacity>

  {/* Modal for Adding Intervention */}
  {isInterventionModalVisible && (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Add Intervention</Text>
        <TextInput
          style={styles.modalInput}
          placeholder="Enter intervention details"
          placeholderTextColor="#999"
          value={newIntervention}
          onChangeText={setNewIntervention}
        />
        <View style={styles.modalButtons}>
          <TouchableOpacity
            style={[styles.modalButton, { backgroundColor: '#ccc' }]}
            onPress={() => setInterventionModalVisible(false)} // Close the modal
          >
            <Text style={styles.modalButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={async () => {
              if (newIntervention.trim() !== '') {
                await addIntervention(newIntervention.trim());
                setNewIntervention('');
                setInterventionModalVisible(false); // Close the modal after adding
              } else {
                Alert.alert('Error', 'Please enter valid intervention details.');
              }
            }}
          >
            <Text style={styles.modalButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )}
</View>


{/* Doctors Section */}
<View style={styles.section}>
  <Image
    source={require('../../assets/images/doctors.png')}
    style={styles.sectionImage}
  />
  <Text style={styles.sectionTitle}>My Doctors</Text>
  <Text style={styles.sectionSubtitle}>
    View and manage your list of doctors.
  </Text>

  {/* Display doctors in a styled list */}
  <View style={styles.allergyList}>
    {doctorList.length === 0 ? (
      <Text style={styles.filePreviewText}>No doctors recorded yet.</Text>
    ) : (
      doctorList.map((item: { id: string; details: string; uploaded_date: string }) => (
        <View key={item.id} style={styles.allergyItem}>
          <Text style={styles.allergyText}>{item.details}</Text>
          <Text style={styles.allergyDate}>
            Added on {new Date(item.uploaded_date).toLocaleDateString()}
          </Text>
        </View>
      ))
    )}
  </View>

  {/* Add Doctor Button */}
  <TouchableOpacity
    style={styles.addButton}
    onPress={() => setDoctorModalVisible(true)}
  >
    <Text style={styles.addButtonText}>Add Doctor</Text>
  </TouchableOpacity>
</View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      backgroundColor: '#E8F5FF', // Baby blue pastel background color
      padding: 20,
    },
    header: {
      marginBottom: 20,
      alignItems: 'center',
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#3D5A80', // Deep blue color
    },
    subtitle: {
      fontSize: 16,
      color: '#555555', // Gray subtitle color
    },
    section: {
      marginBottom: 30,
      backgroundColor: '#FFFFFF', // White card background
      borderRadius: 15,
      padding: 20,
      shadowColor: '#000', // Shadow for card effect
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 5,
      elevation: 3, // Shadow for Android
      alignItems: 'center',
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#3D5A80', // Deep blue color
      marginBottom: 10,
      textAlign: 'center',
    },
    sectionSubtitle: {
      fontSize: 14,
      color: '#555555', // Gray subtitle color
      marginBottom: 20,
      textAlign: 'center',
    },
    sectionImage: {
      width: 60,
      height: 60,
      marginBottom: 10,
    },
    uploadButton: {
      backgroundColor: '#4CAF50', // Green button
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 20,
      alignItems: 'center',
      marginBottom: 15,
    },
    uploadButtonText: {
      color: '#FFFFFF', // White text
      fontSize: 14,
      fontWeight: 'bold',
    },
    filePreview: {
      backgroundColor: '#F4F4F4', // Light gray background for file preview
      padding: 10,
      borderRadius: 10,
      alignItems: 'center',
    },
    filePreviewText: {
      color: '#999999', // Gray text for file preview
      fontSize: 14,
    },
    input: {
      borderWidth: 1,
      borderColor: '#CCCCCC', // Light gray border
      borderRadius: 8,
      padding: 10,
      marginBottom: 15,
      backgroundColor: '#FFFFFF', // White background for input
      color: '#333333', // Dark text color
    },
    addButton: {
      backgroundColor: '#FFA500', // Orange button
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 20,
      alignItems: 'center',
      marginBottom: 15,
    },
    addButtonText: {
      color: '#FFFFFF', // White text
      fontSize: 14,
      fontWeight: 'bold',
    },
    allergyList: {
      marginTop: 15,
      backgroundColor: '#F4F4F4',
      padding: 15,
      borderRadius: 10,
      alignItems: 'stretch',
    },
    allergyText: {
      fontSize: 16,
      color: '#3D5A80',
      fontWeight: 'bold',
    },
    treatmentList: {
      backgroundColor: '#F4F4F4', // Light gray background for list
      padding: 10,
      borderRadius: 10,
      alignItems: 'center',
    },
    diagnosisList: {
      backgroundColor: '#F4F4F4', // Light gray background for list
      padding: 10,
      borderRadius: 10,
      alignItems: 'center',
    },
    vaccineList: {
      backgroundColor: '#F4F4F4', // Light gray background for list
      padding: 10,
      borderRadius: 10,
      alignItems: 'center',
    },
    doctorList: {
      backgroundColor: '#F4F4F4', // Light gray background for list
      padding: 10,
      borderRadius: 10,
      alignItems: 'center',
    },
    allergyItem: {
      marginBottom: 10,
      padding: 10,
      backgroundColor: '#FFFFFF',
      borderRadius: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    allergyDate: {
      fontSize: 12,
      color: '#555555',
      marginTop: 5,
    },
    modalOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      width: '80%',
      backgroundColor: '#FFF',
      padding: 20,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 5,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 15,
      textAlign: 'center',
    },
    modalInput: {
      borderWidth: 1,
      borderColor: '#CCC',
      borderRadius: 8,
      padding: 10,
      marginBottom: 20,
      color: '#333',
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    modalButton: {
      flex: 1,
      backgroundColor: '#4CAF50',
      paddingVertical: 10,
      paddingHorizontal: 15,
      marginHorizontal: 5,
      borderRadius: 8,
      alignItems: 'center',
    },
    modalButtonText: {
      color: '#FFF',
      fontSize: 14,
      fontWeight: 'bold',
    },
    bloodTypeText: {
      fontSize: 16, // Medium font size for readability
      fontWeight: 'bold', // Bold text for emphasis
      color: '#3D5A80', // Deep blue color to match the theme
      textAlign: 'center', // Center-align the text
      marginVertical: 10, // Add some vertical spacing
    },
    interventionList: {
      backgroundColor: '#F4F4F4', // Light gray background for list
      padding: 10,
      borderRadius: 10,
      alignItems: 'center', // Center-align the items
      marginTop: 10, // Add some spacing from the title/subtitle
    },
    
  });
  