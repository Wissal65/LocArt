// GoButton.js
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { faArrowAltUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesome5 } from '@expo/vector-icons';

const GoButton = ({ onPress, isGoing }) => {
  return (
    <TouchableOpacity style={styles.goButton} onPress={onPress}>
      <FontAwesome5 name="level-up-alt" size={16} color={isGoing ? "black" : "#007bff"} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  goButton: {
    flexDirection: 'row', 
    backgroundColor: 'white', 
    padding: 10,
    borderRadius: 5,
    alignItems: 'center', 
    justifyContent: 'center', 
    borderRadius: 40,
  },
});

export default GoButton;
