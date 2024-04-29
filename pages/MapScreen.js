import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, FlatList, Text, TouchableOpacity, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { FontAwesome } from '@expo/vector-icons';
import "react-native-gesture-handler";
import { BottomSheetModal, BottomSheetModalProvider, } from "@gorhom/bottom-sheet";
import { useRef } from "react";
import { ScrollView } from 'react-native-gesture-handler';
import { useFocusEffect } from '@react-navigation/native';


export default function App() {
  const bottomSheetModalRef = useRef(null);
  const snapPoints = ["10%", "20%", "43%"];


  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [markerCoords, setMarkerCoords] = useState(null);
  const [inputStyle, setInputStyle] = useState(styles.input);
  const [searchResultsStyle, setSearchResultsStyle] = useState(styles.searchResults);

  



  const myFunction = () => {
    bottomSheetModalRef.current?.dismiss(); // Close the modal
    setTimeout(() => {
      bottomSheetModalRef.current?.present(); // Reopen the modal after a short delay
    }, 100);

  };


  const handlePresentModal = () => {
    myFunction(); // Set initial snap point index
  };

  useEffect(() => {
    handlePresentModal();
  }, []);


  useFocusEffect(
    React.useCallback(() => {
      handlePresentModal();
    }, [])
  );



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
          // Clear search results
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
          ...inputStyle,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
        });
        setSearchResultsStyle({
          ...searchResultsStyle,
          backgroundColor: '#fff',
          borderBottomLeftRadius: 25,
          borderBottomRightRadius: 25,
        });
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  const handleItemPress = (item) => {
    setSearchQuery(item.display_name);
    setRegion({
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon),
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
    setMarkerCoords({ latitude: parseFloat(item.lat), longitude: parseFloat(item.lon) });
    setSearchResults([]);
    // Reset input and search results styles
    setInputStyle(styles.input);
    setSearchResultsStyle(styles.searchResults);
  };

  const renderSearchItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleItemPress(item)}>
      <Text style={styles.searchItem}>{item.display_name}</Text>
    </TouchableOpacity>
  );

  return (
    <BottomSheetModalProvider>
      <View style={styles.container}>
        <MapView style={styles.map} region={region}>
          {markerCoords && <Marker coordinate={markerCoords} />}
        </MapView>
        <View style={styles.overlay}>
          <View style={styles.inputContainer}>
            <TextInput
              style={inputStyle}
              placeholder="Search location..."
              value={searchQuery}
              onChangeText={text => {
                setSearchQuery(text);
                handleSearch();
              }}
            />
            <TouchableOpacity style={styles.searchIcon} onPress={handleSearchButton}>
              <FontAwesome name="search" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <FlatList
            style={searchResultsStyle}
            data={searchResults}
            renderItem={renderSearchItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>

       

      </View>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={1}
        snapPoints={snapPoints}
        backgroundStyle={{ borderRadius: 27 }}
      >
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Latest in Rabat Sale</Text>
          <Text>Iconic Places</Text>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            pagingEnabled={true}
            contentContainerStyle={styles.imageScrollView}>
            <Image
              source={require('../assets/image1.jpg')}
              style={styles.image}
            />
            <Image
              source={require('../assets/image2.jpg')}
              style={styles.image}
            />
            <Image
              source={require('../assets/image3.jpg')}
              style={styles.image}
            />
            <Image
              source={require('../assets/image4.jpg')}
              style={styles.image}
            />
            <Image
              source={require('../assets/image5.jpg')}
              style={styles.image}
            />
          </ScrollView>
        </View>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );



}

export const getMyFunction = () => {
  // You can return a function that calls myFunction from App component
  return () => {
    myFunction();
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  inputContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '95%',
  },
  input: {
    backgroundColor: '#fff',
    height: 50,
    width: '90%',
    borderRadius: 25,
    paddingHorizontal: 20,
    marginTop: 60,
    elevation: 10,
    paddingRight: 60, // Add padding to the right of the input text
  },
  searchIcon: {
    position: 'absolute',
    top: 72,
    right: 35,
    zIndex: 2,
    paddingLeft: 40,
  },
  searchResults: {
    width: '85.5%',
    maxHeight: 150,
  },
  searchItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  bottomMenu: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 25,
    elevation: 6,
    width: '100%',
    bottom: 0,
    alignSelf: 'center',
  },
  menuItem: {
    padding: 10,
  },
  contentContainer: {
    flex: 1,
    marginLeft: 10,
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  title: {
    fontWeight: "600",
    letterSpacing: 0.5,
    fontSize: 16,
    paddingBottom: 10,
  },
  imageScrollView: {
    flexDirection: 'row',
    marginTop: 10,
    marginRight: 5,
  },
  image: {
    marginLeft: 10,
    width: 250,
    height: 200,
    borderRadius: 10,
  },
});