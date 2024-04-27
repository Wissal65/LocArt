// Import necessary modules
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, addDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from "firebase/auth";


// Define the SignUpScreen component
export default function SignUpScreen({ auth , db }) {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');


  // Function to handle sign up
  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      const userRef = await addDoc(collection(db , "users"), {
        email: email,
        fullName: fullName,
        userid: user.uid
      });
  
      alert('Sign up successful with doc id: ' + userRef.id); // Correct alert syntax
      navigation.navigate('Login');
    } catch (error) {
      const errorMessage = error.message;
      alert('Sign up failed: ' + errorMessage);
    }
  };
  
  

  return (
    <ImageBackground source={require('../assets/bg1.png')} style={styles.background}>
      <View style={styles.container}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <Text style={styles.title}>Sign Up</Text>

        <View style={styles.formContainer}>
          {/* TextInput for full name */}
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={fullName}
            onChangeText={text => setFullName(text)} // Update the state with the input value
          />
          {/* TextInput for email */}
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={text => setEmail(text)}
          />
          {/* TextInput for password */}
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={true}
            value={password}
            onChangeText={text => setPassword(text)}
          />
          {/* TextInput for confirming password */}
          <TextInput style={styles.input} placeholder="Confirm Password" secureTextEntry={true} />
        </View>

        {/* Button to sign up */}
        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        {/* Link to navigate to login screen */}
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

// Styles for the component
const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  logo: {
    marginTop: 80,
    width: 75,
    height: 90,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  formContainer: {
    width: '80%',
    marginBottom: 40,
    marginTop: 100,
  },
  input: {
    width: '100%',
    height: 48,
    marginBottom: 18,
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingLeft: 15,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 4, // For Android
  },
  button: {
    width: '78%',
    height: 48,
    backgroundColor: '#fb7c39',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 8,
    color: '#fb7c39',
    textDecorationLine: 'underline',
  },
});
