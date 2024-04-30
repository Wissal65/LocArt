import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDocs, collection } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore'; // Import getFirestore


export default function ProfileScreen({ auth }) {
  const navigation = useNavigation();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');

  const firestore = getFirestore();

  useEffect(() => {
    if (auth.currentUser) {
      const fetchData = async () => {
        try {
          const userId = auth.currentUser.uid;
          const querySnapshot = await getDocs(collection(firestore, 'users'));
          querySnapshot.forEach((doc) => {
            const userData = doc.data();
            if (userData.userid === userId) {
              setFullName(userData.fullName);
              setEmail(userData.email);
            }
          });
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };

      fetchData();
    }
  }, [firestore]);

  const handleEditProfile = () => {
    // Handle edit profile action
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top container */}
      <View style={styles.blueContainer}>
        <View style={styles.topContainer}>
          {/* Back button */}
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <FontAwesome name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          {/* Title */}
          <Text style={styles.title}>Profile</Text>
          {/* Edit button */}
          <TouchableOpacity onPress={handleEditProfile} style={styles.editButton}>
            <FontAwesome name="pencil" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* User profile */}
        <View style={styles.profileContainer}>
          <Image source={require('../assets/p6.png')} style={styles.profileImage} />
          <Text style={styles.fullName}>{fullName}</Text>
          <Text style={styles.email}>{email}</Text>
        </View>

      </View>

      {/* Menu */}
      <View style={styles.menuContainer}>
        {/* Menu items */}
        <TouchableOpacity style={styles.menuItem}>
          <FontAwesome style={styles.menuItemIcon} name="language" size={20} color="#3b335d" />
          <Text style={styles.menuText}>Language</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <FontAwesome style={styles.menuItemIcon} name="headphones" size={20} color="#3b335d" />
          <Text style={styles.menuText}>Support</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <FontAwesome style={styles.menuItemIcon} name="shield" size={20} color="#3b335d" />
          <Text style={styles.menuText}>Privacy Policy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <FontAwesome style={styles.menuItemIcon} name="question-circle" size={20} color="#3b335d" />
          <Text style={styles.menuText}>FAQ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <FontAwesome style={styles.menuItemIcon} name="sign-out" size={20} color="#3b335d" />
          <Text style={styles.menuText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  blueContainer: {
    backgroundColor: '#6383fc',
    marginBottom: 10,
    paddingBottom: 10,
  },
  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    marginTop: 40,
  },
  backButton: {
    marginRight: 'auto',
  },
  title: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  editButton: {
    marginLeft: 'auto',
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  profileImage: {
    width: 145,
    height: 145,
    borderRadius: 60,
  },
  fullName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  email: {
    marginTop: 2,
    fontSize: 16,
    color: 'white',
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    marginHorizontal: 15,
    marginVertical: 8,
    borderRadius: 6,
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#f9f9f9',
  },
  menuText: {
    fontSize: 16,
    color: '#3b335d',
  },
  menuItemIcon: {
    marginRight: 10,
  }
});
