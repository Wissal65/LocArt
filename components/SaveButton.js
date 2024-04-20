import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBookmark as solidBookmark } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as outlineBookmark } from '@fortawesome/free-regular-svg-icons';

const SaveButton = ({ onPress, isSaved }) => {

  return (
    <TouchableOpacity style={styles.saveButton}  onPress={onPress}>
      <FontAwesomeIcon icon={isSaved?  solidBookmark:outlineBookmark  } size={16} color="#007bff" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  saveButton: {
    flexDirection: 'row', 
    backgroundColor: 'white', 
    padding: 10,
    borderRadius: 5,
    alignItems: 'center', 
    justifyContent: 'center', 
    borderRadius: 40,
  },
});

export default SaveButton;
