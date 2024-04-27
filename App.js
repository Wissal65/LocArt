import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

import HomeScreen from './pages/HomeScreen';
import LoginScreen from './pages/LoginScreen';
import SignUpScreen from './pages/SignUpScreen';
import SettingsScreen from './pages/SettingsScreen';
import MapScreen from './pages/MapScreen';
import TransportScreen from './pages/TransportScreen';
import LayersScreen from './pages/LayersScreen';
import SavedScreen from './pages/SavedScreen';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { getMyFunction } from './pages/MapScreen';
import { getMyTransportFunction } from './pages/TransportScreen';
import { getMyLayersFunction } from './pages/LayersScreen';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();


const firebaseConfig = {
  apiKey: "AIzaSyBSr5AKQJrThLqQbTDhoGSuRGC-Y8thjNc",
  authDomain: "leaflet-react-app.firebaseapp.com",
  projectId: "leaflet-react-app",
  storageBucket: "leaflet-react-app.appspot.com",
  messagingSenderId: "32428087725",
  appId: "1:32428087725:web:c114b4741a3d492d27a924",
  measurementId: "G-QD7BXYM09N"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login">
          {props => <LoginScreen {...props} auth={auth} />}
        </Stack.Screen>
        <Stack.Screen name="SignUp">
          {props => <SignUpScreen {...props} auth={auth} db={db} />}
        </Stack.Screen>
        <Stack.Screen name="Main" component={MainTabScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function MainTabScreen() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0951bd',
        tabBarInactiveTintColor: '#5f6062',
        tabBarLabelStyle: {
          fontSize: 12,
          paddingBottom: 10,
        },
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#ccc',
          height: 70,
          paddingTop: 7,
          paddingBottom: 5,
        }
      }}
    >
      <Tab.Screen
        name="Explore"
        component={MapScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="map-pin" size={size} color={color} />
          ),
        }}
        listeners={{
          tabPress: () => {
            getMyFunction(); // Call myFunction when "Explore" tab is pressed
          },
        }}

      />
      <Tab.Screen
        name="Go"
        component={TransportScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="bus-alt" size={size} color={color} />
          ),
        }}
        listeners={{
          tabPress: () => {
            getMyTransportFunction();
          },
        }}
      />
      <Tab.Screen
        name="Saved"
        component={SavedScreen}
        initialParams={{ auth, db }}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="bookmark" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Layers"
        component={LayersScreen}
        initialParams={{ auth, db }}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="map-marked" size={size} color={color} />
          ),
        }}
        listeners={{
          tabPress: () => {
            getMyLayersFunction();
          },
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        initialParams={{ auth }}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="cog" size={size} color={color} />
          ),
        }}
      />

    </Tab.Navigator>
  );
}
