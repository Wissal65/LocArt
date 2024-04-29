import React, { useState, useEffect } from 'react';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native';
import axios from 'axios';
import polyline from '@mapbox/polyline';
import { BottomSheetModal, BottomSheetModalProvider, } from "@gorhom/bottom-sheet";
import { useRef } from "react";
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import { useFocusEffect } from '@react-navigation/native';


export default function TransportScreen({ route  }) {
  const { selectedPlace , item } = route.params || {};

  const [inputText, setInputText] = useState('');

  const [region, setRegion] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [endPointName, setEndPointName] = useState('');
  const [routeSelected, setRouteSelected] = useState(null);
  const [polylineCoords, setPolylineCoords] = useState([]);
  const inputRef = useRef(null);
  const [containerHeight, setContainerHeight] = useState(0);

  const handleLayout = (event) => {
    const { height } = event.nativeEvent.layout;
    setContainerHeight(height);
  };

  const maxRetries = 3;
  const baseDelay = 1000; // in milliseconds
  const retryDelayMultiplier = 2;

  const axiosInstance = axios.create();

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      let retryCount = 0;
      while (retryCount < maxRetries) {
        retryCount++;
        await new Promise((resolve) =>
          setTimeout(resolve, baseDelay * Math.pow(retryDelayMultiplier, retryCount))
        );
        try {
          const response = await axiosInstance(error.config);
          return response;
        } catch (retryError) {
          error = retryError;
        }
      }
      return Promise.reject(error);
    }
  );

  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [markerCoords, setMarkerCoords] = useState(null);

  const [inputStyle, setInputStyle] = useState(styles.input);
  const [searchResultsStyle, setSearchResultsStyle] = useState(styles.searchResults);

  const [selectedVehicle, setSelectedVehicle] = useState("car");

  const currentTime = new Date();
  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const seconds = currentTime.getSeconds();

  const bottomSheetModalRef = useRef(null);
  const snapPoints = ["10%", "22%", "60%", "90%"];

  const myTransportFunction = () => {
    bottomSheetModalRef.current?.present();
  };

  const handlePresentModal = () => {
    myTransportFunction();
  };

  const focusInput = () => {
    // Check if the ref and input element exist
    if (inputRef.current) {
      // Focus on the input element
      inputRef.current.focus();
    }
  };

  

  useEffect(() => {
    getLocation();
    handlePresentModal();
    
    console.log("Selected Place from layers screen:", selectedPlace);
    if (selectedPlace && selectedPlace.title) {
      setInputText(selectedPlace.title);
    }

    console.log("Selected Place from Saved screen:", item);
    if (item && item.title) {
      setInputText(item.title);
    }
  }, []);

  

  const getDirections = () => {
    bottomSheetModalRef.current?.snapToIndex(2);
    handleGetRoute();
  }

  const formatDuration = (milliseconds) => {
    // Convert milliseconds to hours, minutes, and seconds
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));

    // Construct the formatted string
    let formattedDuration = '';
    if (hours > 0) formattedDuration += `${hours} hr `;
    if (minutes > 0) formattedDuration += `${minutes} min `;

    return formattedDuration.trim();
  };

  const convertDistance = (distance) => {
    if (distance >= 1000) {
      return `(${Math.floor(distance / 1000)} km)`;
    } else {
      return `(${Math.floor(distance)} m)`;
    }
  };


  const renderIcon = (sign) => {
    const iconContainerStyle = {
      marginTop: 15, // Adjust the margin top value as needed
    };
    switch (sign) {
      case 0:
        // starting point or continue straight
        return (
          <View style={iconContainerStyle}>
            <FontAwesome5 name="map-pin" size={16} color="red" />
          </View>
        );
      case 2:
        // turn right
        return (
          <View style={iconContainerStyle}>
            <FontAwesome5 name="arrow-right" size={16} color="gray" />
          </View>
        );
      case -2:
        // turn left
        return (
          <View style={iconContainerStyle}>
            <FontAwesome5 name="arrow-left" size={16} color="gray" />
          </View>
        );
      case 6:
        // roundpoint
        return (
          <View style={iconContainerStyle}>
            <FontAwesome5 name="circle" size={16} color="gray" />
          </View>
        );
      case 7:
        // strong left
        return (
          <View style={iconContainerStyle}>
            <FontAwesome5 name="arrow-left" size={16} color="red" />
          </View>
        );
      case 4:
        // Arrived at destination
        return (
          <View style={iconContainerStyle}>
            <FontAwesome5 name="map-marker-alt" size={16} color="green" />
          </View>
        );
      default:
        return (
          <View style={iconContainerStyle}>
            <FontAwesome5 name="map-marker-alt" size={16} color="gray" />
          </View>
        );
    }
  };



  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.error('Permission to access location was denied');
      return;
    }

    Location.watchPositionAsync({ accuracy: Location.Accuracy.High, timeInterval: 1000 }, location => {
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });

      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

    });
  };

  function decodePolyline(polylineString) {
    const decodedCoordinates = polyline.decode(polylineString);

    return decodedCoordinates.map(coord => ({
      latitude: coord[0],
      longitude: coord[1],
    }));
  }

  const handleGetRoute = async () => {
    if (!currentLocation) {
      console.error('Current location not available.');
      return;
    }

    bottomSheetModalRef.current?.present();
    // const apiKey = '3dfcf829-eeb5-4103-9b37-66840643d960';
    const apiKey = 'ed829076-c8c4-4a7c-8e8c-fd2fd976303d' ;
    // vehicle = vehicle;

    try {
      const response = await axiosInstance.get(
        `https://graphhopper.com/api/1/geocode?q=${endPointName}&key=${apiKey}`
      );


      const endPoint = {
        latitude: response.data.hits[0].point.lat,
        longitude: response.data.hits[0].point.lng,
      };

      // Set the route from current location to the entered endpoint
      getRoute(apiKey, currentLocation, endPoint, selectedVehicle);


      // Add a new marker for the entered endpoint
      setMarkers([...markers, { id: markers.length + 1, latitude: endPoint.latitude, longitude: endPoint.longitude }]);
    } catch (error) {
      console.error('Error geocoding endpoint:', error);
    }
  };


  const getRoute = async (apiKey, startPoint, endPoint, vehicle) => {
    try {
      const response = await axiosInstance.get(
        `https://graphhopper.com/api/1/route?point=${startPoint.latitude},${startPoint.longitude}&point=${endPoint.latitude},${endPoint.longitude}&vehicle=${vehicle}&key=${apiKey}`
      );

      console.log('Response Data:', response.data); // Log the response data

      const { paths } = response.data;
      if (paths && paths.length > 0) {
        const polylineString = paths[0].points;
        if (polylineString) {
          // Decode polyline and set route and polyline coordinates
          const polylineCoords = decodePolyline(polylineString);
          setRouteSelected(response.data);
          setPolylineCoords(polylineCoords);
        } else {
          console.error('No polyline points found in the response data');
        }
      } else {
        console.error('No paths found in the response data');
      }
    } catch (error) {
      console.error('Error fetching route:', error);
    }
  };

  // 
  const renderSearchItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleItemPress(item)}>
      <Text style={styles.searchItem}>{item.display_name}</Text>
    </TouchableOpacity>
  );


  // Update handleSearch function to adjust search results styling and display them immediately
  const handleSearch = () => {
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`)
      .then(response => response.json())
      .then(data => {
        setSearchResults(data);
        setInputStyle({
          ...inputStyle,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
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

  // Update handleItemPress function to reset search input and hide search results after an item is pressed
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
    setInputStyle({
      ...styles.input,
      borderBottomRightRadius: 25,
      borderBottomLeftRadius: 25,
    });
    setSearchResultsStyle(styles.searchResults);

    // Set endpoint name and fetch route
    setEndPointName(item.display_name);
    console.log("End Point Name:", endPointName);
    handleGetRoute();
    setEndPointName('');
  };





  const handleVehicleSelection = (vehicleType) => {
    setSelectedVehicle(vehicleType);
    handleGetRoute();
  };



  return (
    <BottomSheetModalProvider>
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            ref={inputRef}
            style={[
              styles.input,
              inputStyle, // Apply dynamic input styles
            ]}
            value={inputText}
            placeholder="Destination Name"
            onChangeText={text => {
              setInputText(text);
              setEndPointName(text);
              setSearchQuery(text);
              handleSearch(); // Call handleSearch function on text change
            }}
          />
          <TouchableOpacity style={styles.searchIcon} onPress={() => { handleGetRoute(); }}>
            <FontAwesome name="search" size={24} color="black" />
          </TouchableOpacity>

          <FlatList
            style={[
              styles.searchResults,
              searchResultsStyle, // Apply dynamic search results styles
            ]}
            data={searchResults}
            renderItem={renderSearchItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>



        {region && (
          <MapView style={styles.map} region={region}>
            {markers.map((marker, index) => (
              <Marker
                key={index}
                coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                title={marker.title}
                description={marker.description}
              />
            ))}
            {currentLocation && (
              <>
                <Marker
                  coordinate={{ latitude: currentLocation.latitude, longitude: currentLocation.longitude }}
                  pinColor="blue" // Change marker color
                  title="Current Location"
                />
                {routeSelected && (
                  <Polyline
                    coordinates={polylineCoords}
                    strokeWidth={5}
                    strokeColor="blue"
                  />
                )}
              </>
            )}
          </MapView>
        )}
        {!region && <Text>Loading...</Text>}

      </View>


      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={1}
        snapPoints={snapPoints}
        backgroundStyle={{ borderRadius: 27 }}
      >


        {/* <Text style={styles.title}>{endPointName}</Text> */}
        <View style={styles.routeContainer}>
          {/* Conditional rendering for default content */}
          {!routeSelected ? (
            <View style={styles.defaultBox}>
              <View style={styles.defaultContentContainer}>
                <Text style={styles.defaultTitle}>Home</Text>
                <Text style={styles.defaultText}>{hours}:{minutes < 10 ? `0${minutes}` : minutes}</Text>

              </View>
              <Text style={styles.defaultNote}>Discover hidden gems around you</Text>
              <TouchableOpacity style={styles.defaultbutton} onPress={focusInput} >
                <FontAwesome5 name="chevron-up" size={16} color="white" />
                <Text style={styles.defaultButtonText}>Start</Text>
              </TouchableOpacity>
              <Text style={styles.suggestionsText}>Suggestions</Text>
              <Text style={styles.suggestionsNoteText}>explore outstanding cultural spots in Rabat</Text>
              <ScrollView style={styles.ScrollView}>
                <TouchableOpacity style={styles.placeSuggested} onPress={() => {
                  setEndPointName('Oudaya Rabat');
                  handleGetRoute(); // Call handleGetRoute function
                }}>
                  <FontAwesome5 name="monument" size={15} color="#3d72c9" />
                  <Text style={styles.placeSuggestedText}>Kasbah of the Udayas</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.placeSuggested} onPress={() => {
                  setEndPointName('Hassan Tower rabat');
                  handleGetRoute(); // Call handleGetRoute function
                }}>
                  <FontAwesome5 name="mosque" size={15} color="#3d72c9" />
                  <Text style={styles.placeSuggestedText}>Hassan Tower</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.placeSuggested} onPress={() => {
                  setEndPointName('Mohammed VI Museum of Modern and Contemporary Art rabat');
                  handleGetRoute();
                }}>
                  <FontAwesome5 name="landmark" size={15} color="#3d72c9" />
                  <Text style={styles.placeSuggestedText}>Mohammed Vi Museum</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.placeSuggested} onPress={() => {
                  setEndPointName('Rabat Zoo');
                  handleGetRoute();
                }}>
                  <FontAwesome5 name="paw" size={15} color="#3d72c9" />
                  <Text style={styles.placeSuggestedText}>National Zoo Rabat</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.placeSuggested} onPress={() => {
                  setEndPointName('Bab Chellah rabat');
                  handleGetRoute();
                }}>
                  <FontAwesome5 name="archway" size={15} color="#3d72c9" />
                  <Text style={styles.placeSuggestedText}>Bab Chellah</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.placeSuggested} onPress={() => {
                  setEndPointName('Visitors Gate Royal Palace rabat');
                  handleGetRoute();
                }}>
                  <FontAwesome5 name="synagogue" size={15} color="#3d72c9" />
                  <Text style={styles.placeSuggestedText}>Visitors Gate Royal Palace</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.placeSuggested} onPress={() => {
                  setEndPointName('Central market rabat');
                  handleGetRoute();
                }}>
                  <FontAwesome5 name="industry" size={15} color="#3d72c9" />
                  <Text style={styles.placeSuggestedText}>Rabat Old Market</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.placeSuggested} onPress={() => {
                  setEndPointName('Medina Rabat');
                  handleGetRoute();
                }}>
                  <FontAwesome5 name="place-of-worship" size={15} color="#3d72c9" />
                  <Text style={styles.placeSuggestedText}>Old Medina Rabat</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.placeSuggested} onPress={() => {
                  setEndPointName('Jardins exotiques de Bouknadel');
                  handleGetRoute();
                }}>
                  <FontAwesome5 name="horse-head" size={15} color="#3d72c9" />
                  <Text style={styles.placeSuggestedText}>Les Jardins Exotiques de Bouknadel</Text>
                </TouchableOpacity>

              </ScrollView>
            </View>

          ) : (
            <View
              style={[styles.detailsShown, { marginBottom: containerHeight > 0 ? 10 : 0 }]}
              onLayout={handleLayout}>
              <View style={styles.modalHeader}>
                {/* Back icon */}
                <TouchableOpacity style={styles.backIcon} onPress={() => setRouteSelected(null)}>
                  <FontAwesome5 name="arrow-left" size={17} color="#4a4c4f" />
                </TouchableOpacity>
              </View>
              <View style={styles.destinationinfos}>

                <Text style={styles.timetext}>{formatDuration(routeSelected.paths[0].time)}</Text>
                <Text style={styles.distancetext}>{convertDistance(routeSelected.paths[0].distance)}</Text>



              </View>
              <Text>Find the fastest route now</Text>
              <TouchableOpacity style={styles.directionsButton} onPress={getDirections}>
                <FontAwesome5 name="level-down-alt" size={15} color="white" />
                <Text style={styles.directionsText}>Directions</Text>
              </TouchableOpacity>
              <ScrollView style={styles.detailsContainer}>
                <View style={styles.stepsandButtonsContainer}>
                  <Text style={styles.stepsText}>Steps </Text>
                  <View style={styles.directionsButtonContainer}>
                    <TouchableOpacity
                      style={[styles.vehicleButton, selectedVehicle === 'car' && styles.selectedButton]}
                      onPress={() => handleVehicleSelection('car')}>
                      <FontAwesome5 name="car" size={20} color={selectedVehicle === 'car' ? '#2374e5' : '#4a4c4f'} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.vehicleButton, selectedVehicle === 'scooter' && styles.selectedButton]}
                      onPress={() => handleVehicleSelection('scooter')}
                    >
                      <FontAwesome5 name="motorcycle" size={20} color={selectedVehicle === 'scooter' ? '#2374e5' : '#4a4c4f'} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.vehicleButton, selectedVehicle === 'foot' && styles.selectedButton]}
                      onPress={() => handleVehicleSelection('foot')}
                    >
                      <FontAwesome5 name="walking" size={20} color={selectedVehicle === 'foot' ? '#2374e5' : '#4a4c4f'} />
                    </TouchableOpacity>
                  </View>
                </View>
                {/* Instructions */}
                {routeSelected.paths[0].instructions.map((instruction, index) => (
                  <View style={styles.stepContainer} key={index}>
                    {renderIcon(instruction.sign)}
                    <View key={index} style={styles.instructionContainer}>
                      <Text style={styles.instructionText}>{instruction.text}</Text>
                      <Text style={styles.distanceLeftText}>{convertDistance(instruction.distance)}</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
}

export const getMyTransportFunction = () => {
  // You can return a function that calls myFunction from App component
  return () => {
    myTransportFunction();
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
    flex: 1,
    width: '100%',
  },
  inputContainer: {
    width: '95%',
    position: 'absolute',
    top: 60,
    zIndex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10, // Add marginBottom to inputContainer
  },
  searchResults: {
    width: '87.5%',
    maxHeight: 150,
    marginTop: 0, // Remove marginTop from searchResults
    marginBottom: 10, // Add marginBottom to searchResults
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 20,
    width: '87.5%',
    height: 50,
    elevation: 10,
  },
  searchIcon: {
    position: 'absolute',
    top: 14,
    right: 35,
    zIndex: 2,
    paddingLeft: 40,
  },
  searchItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  button: {
    backgroundColor: 'lightblue',
    padding: 10,
    borderRadius: 10,
    width: '80%',
    textAlign: 'center',
  },
  routeContainer: {
    position: 'absolute',
    padding: 10,
    borderRadius: 5,
  },
  detailsContainer: {
    marginTop: 20,
    maxHeight: 470,
    width: '100%',
    paddingHorizontal: 20,
  },
  instructionContainer: {
    paddingBottom: 10,
    paddingLeft: 10,
    width: '100%',

  },
  contentContainer: {
    flexDirection: 'column',
    flex: 1,
  },
  destinationinfos: {
    flexDirection: 'row',
    fontSize: 25,
  },
  timetext:
  {
    color: 'green',
    fontSize: 22,
    fontWeight: '600',

  },
  distancetext:
  {
    fontSize: 22,
    color: '#595a5c',
    fontWeight: '500',

  },
  directionsButton: {
    marginTop: 10,
    backgroundColor: '#1b73ea',
    textAlign: 'center',
    width: 120,
    height: 40,
    borderRadius: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  directionsText:
  {
    color: '#fff',
    fontSize: 15,
    paddingLeft: 6,
  },
  detailsShown: {
    marginLeft: 20,
  },
  stepsText: {
    fontSize: 20,
    color: '#595a5c',
    fontWeight: '500',
  },
  stepContainer: {
    right: 0,
    marginTop: 15,
    flexDirection: 'row',
    width: '95%',
  },
  instructionText: {
    color: '#595a5c',
    width: '90%',
    paddingLeft: 6,
  },
  distanceLeftText: {
    paddingLeft: 6,
    paddingBottom: 12,
    color: '#595a5c',
    borderBottomColor: '#595a5c',
    borderBottomWidth: 0.3,
  },
  defaultContentContainer:
  {
    flexDirection: 'row',
    marginLeft: 14,

  },
  defaultTitle:
  {
    fontSize: 20,
    color: '#595a5c',
    fontWeight: '500',
    marginRight: 8,
  },
  defaultText: {
    color: 'green',
    fontSize: 20,
    fontWeight: '600',
  },
  defaultNote: {
    marginTop: 5,
    marginLeft: 14,
    color: '#595a5c',
  },
  defaultbutton: {
    marginLeft: 15,
    marginTop: 10,
    flexDirection: 'row',
    backgroundColor: '#1a73e9',
    padding: 10,
    borderRadius: 20,
    width: 90,
    textAlign: 'center',
    justifyContent: 'center',
  },
  defaultButtonText: {
    color: 'white',
    paddingLeft: 10,
  },
  suggestionsText: {
    marginTop: 15,
    marginLeft: 12,
    fontSize: 16,
    color: '#595a5c',
  },
  suggestionsNoteText: {
    marginTop: 3,
    marginLeft: 12,
    fontSize: 12,
    color: 'gray',
    marginBottom: 10,
  },
  ScrollView:
  {
    height: '100%',
    width: '100%',
  },
  placeSuggested: {
    flexDirection: 'row',
    marginLeft: 15,
    borderBottomColor: '#dadada',
    borderBottomWidth: 0.3,
    width: '100%',
    paddingHorizontal: 10,
    alignItems: 'center',
    height: 50,
  },
  placeSuggestedText: {
    paddingLeft: 10,
    fontSize: 16,
  },
  directionsButtonContainer:
  {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '45%',
    marginRight: 4,
  },
  vehicleButton: {
    padding: 8,
    borderRadius: 35,
  },
  selectedButton: {
    backgroundColor: '#e8f0fd',
    width: 42,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepsandButtonsContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  defaultBox: {
    width: '100%',
  },
  backIcon: {
    marginBottom: 10,
  }
});