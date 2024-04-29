import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export default function LoginScreen({ auth }) {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Signed in successfully
      const user = userCredential.user;
      alert('Login successful');
      navigation.navigate('Main', { screen: 'Map' });
    } catch (error) {
      // Handle login errors
      const errorCode = error.code;
      const errorMessage = error.message;
      alert('Login failed: ' + errorMessage);
    }
  };
  

  return (
    <ImageBackground source={require('../assets/bg1.png')} style={styles.background}>
      <View style={styles.container}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <Text style={styles.title}>Login</Text>

        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={text => setEmail(text)} />

          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={true}
            value={password}
            onChangeText={text => setPassword(text)} />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.link}>New here? Create an account</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

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
    marginTop: 130,
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
    marginBottom: 15,
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
