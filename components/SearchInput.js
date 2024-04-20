import React, { useState } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const SearchInput = ({
  searchQuery,
  setSearchQuery,
  searchResults,
  setSearchResults,
  setRegion,
  setMarkerCoords,
  customStyles,
}) => {
  const [inputStyle, setInputStyle] = useState(styles.input);
  const [searchResultsStyle, setSearchResultsStyle] = useState(styles.searchResults);

  const handleSearchButton = () => {
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`)
      .then(response => response.json())
      .then(data => {
        console.log('Response from API:', data);
        if (data.length > 0) {
          const { lat, lon } = data[0];
          setRegion({
            latitude: parseFloat(lat),
            longitude: parseFloat(lon),
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
          setMarkerCoords({ latitude: parseFloat(lat), longitude: parseFloat(lon) });
          setInputStyle(styles.input);
          setSearchResultsStyle(styles.searchResults);
          setSearchResults([]);
        } else {
          console.log('No results found');
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  const handleSearch = () => {
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`)
      .then(response => response.json())
      .then(data => {
        setSearchResults(data);
        setInputStyle({
          ...styles.input,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
          width: '90%',
        });
        setSearchResultsStyle({
          ...styles.searchResults,
          backgroundColor: '#fff',
          borderBottomLeftRadius: 25,
          borderBottomRightRadius: 25,
          width: '75%', 
        });
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  const handleItemPress = item => {
    setSearchQuery(item.display_name);
    setRegion({
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon),
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
    setMarkerCoords({ latitude: parseFloat(item.lat), longitude: parseFloat(item.lon) });
    setSearchResults([]);
    setInputStyle(styles.input);
    setSearchResultsStyle(styles.searchResults);
  };

  const renderSearchItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleItemPress(item)}>
      <Text style={styles.searchItem}>{item.display_name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={customStyles.container}>
      <View style={customStyles.inputContainer}>
        <TextInput
          style={[styles.input, inputStyle]} // Apply inputStyle
          placeholder="Search location..."
          value={searchQuery}
          onChangeText={text => {
            setSearchQuery(text);
            if (text.trim() !== '') {
              handleSearch();
            } else {
              setSearchResults([]);
            }
          }}
        />
        <TouchableOpacity style={styles.searchIcon} onPress={handleSearchButton}>
          <FontAwesome name="search" size={24} color="black" />
        </TouchableOpacity>
      </View>
      {searchResults.length > 0 && (
        <FlatList
          style={[styles.searchResults, searchResultsStyle]} // Apply searchResultsStyle
          data={searchResults}
          renderItem={renderSearchItem}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>
  );
};

export default SearchInput;

const defaultStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    width:'100%',
  },
  inputContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  input: {
    backgroundColor: 'white',
    height: 50,
    width: '100%',
    borderRadius: 25,
    paddingHorizontal: 20,
    marginTop: 60,
    elevation: 10,
    paddingRight: 60, // Add padding to the right of the input text
  },
  searchIcon: {
    position: 'absolute',
    top: 72,
    right: 25,
    zIndex: 2,
    paddingLeft: 40,
  },
  searchResults: {
    width: '100%', // Set default width to 100%
    maxHeight: 100,
  },
  searchItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

// Merge custom styles with existing styles
const styles = { ...defaultStyles };
