import { Tabs } from 'expo-router';
import { Image } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#3D5A80', // Active tab color
        tabBarInactiveTintColor: '#999999', // Inactive tab color
        tabBarStyle: { backgroundColor: '#EFC3CA' }, // Tab bar background color
        tabBarItemStyle: { marginHorizontal: 6 },
        tabBarLabelStyle: { fontSize: 8 },
        tabBarShowLabel: false,
        headerShown: false, // Disable header globally
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false, // Ensure header is hidden for this screen
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('../../assets/images/homeLogo.png')}
              style={{
                width: 38,
                height: 38,
              }}
            />
          ),
          tabBarLabel: 'Home',
        }}
      />
      <Tabs.Screen
        name="healthchat"
        options={{
          headerShown: false, // Ensure header is hidden for this screen
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('../../assets/images/AIRecom.png')}
              style={{
                width: 38,
                height: 38,
              }}
            />
          ),
          tabBarLabel: 'MedChat',
        }}
      />
      <Tabs.Screen
        name="health-data"
        options={{
          headerShown: false, // Ensure header is hidden for this screen
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('../../assets/images/HealthData.png')}
              style={{
                width: 38,
                height: 38,
              }}
            />
          ),
          tabBarLabel: 'Data',
        }}
      />
      <Tabs.Screen
        name="symptom-log"
        options={{
          headerShown: false, // Ensure header is hidden for this screen
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('../../assets/images/SymptomLog.png')}
              style={{
                width: 38,
                height: 38,
              }}
            />
          ),
          tabBarLabel: 'SymLogs',
        }}
      />
      <Tabs.Screen
        name="appointments"
        options={{
          headerShown: false, // Ensure header is hidden for this screen
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('../../assets/images/Appointments.png')}
              style={{
                width: 38,
                height: 38,
              }}
            />
          ),
          tabBarLabel: 'Appointments',
        }}
      />
    </Tabs>
  );
}
