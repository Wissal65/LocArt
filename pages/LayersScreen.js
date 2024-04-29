import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Image, Alert } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons'; // Import FontAwesome5
import { Marker } from 'react-native-maps';
import ClusteredMapView from 'react-native-maps-super-cluster';
import culturaldata from '../data/data.json';
import * as Location from 'expo-location';
import { BottomSheetModal, BottomSheetModalProvider, } from "@gorhom/bottom-sheet";
import { useFocusEffect } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { collection, addDoc, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import SaveButton from '../components/SaveButton';
import GoButton from '../components/GoButton';


export default function LayersScreen({ navigation, route }) {
  const [initRegion, setInitRegion] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filteredData, setFilteredData] = useState([]);

  const [isSaved, setIsSaved] = useState(false);
  const [isGoing, setIsGoing] = useState(false);

  const { auth, db } = route.params;


  const [selectedPlace, setSelectedPlace] = useState(null);
  const bottomSheetModalRef = useRef(null);
  const snapPoints = ["10%", "45%", "85%"];

  const myLayersFunction = () => {
    bottomSheetModalRef.current?.dismiss(); // Close the modal
    setTimeout(() => {
      bottomSheetModalRef.current?.present(); // Reopen the modal after a short delay
    }, 100);

  };
  const handlePresentModal = () => {
    myLayersFunction();
  };



  const addToFirebase = async (place) => {
    const user = auth.currentUser;
    try {
      if (user) {
        console.log("Authenticated user ID:", user.uid);
        const querySnapshot = await getDocs(query(collection(db, "favoritemarkers"), where("id", "==", place.id), where("userid", "==", user.uid)))
        if (querySnapshot.empty) {
          const userRef = await addDoc(collection(db, "favoritemarkers"), {
            title: place.title,
            id: place.id,
            userid: user.uid
          });
          setIsSaved(true);
          Alert.alert('Location Saved', 'This location has been saved to your favorites.');
        } else {
          Alert.alert(
            'Unsave Location',
            'Do you want to unsave this location?',
            [
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel'
              },
              {
                text: 'Unsave',
                onPress: async () => {
                  querySnapshot.forEach(async (doc) => {
                    await deleteDoc(doc.ref);
                  });
                  setIsSaved(false);
                  Alert.alert('Location Unsaved', 'This location has been removed from your favorites.');
                }
              }
            ],
            { cancelable: false }
          );
        }
      }
    } catch (error) {
      console.error('Error saving location:', error);
      Alert.alert('Error', 'Failed to save location. Please try again later.');
    }
  };



  useEffect(() => {
    const fetchSavedLocations = async () => {
      const user = auth.currentUser;
      try {
        if (user && selectedPlace) {
          const querySnapshot = await getDocs(query(collection(db, "favoritemarkers"), where("id", "==", selectedPlace.id), where("userid", "==", user.uid)));
          setIsSaved(!querySnapshot.empty);
        }
      } catch (error) {
        console.error('Error fetching saved locations:', error);
      }
    };

    fetchSavedLocations();

    handlePresentModal();
    getLocation();
    setData([
      ...culturaldata.culinaryHotspots.map(item => ({ ...item, type: 'culinary' })),
      ...culturaldata.musicVenues.map(item => ({ ...item, type: 'music' })),
      ...culturaldata.artInstallations.map(item => ({ ...item, type: 'art' })), // Corrected type
      ...culturaldata.historicalSites.map(item => ({ ...item, type: 'historical' })) // Corrected type
    ]);
  }, [selectedPlace, auth, db]);

  const getImageNameForCategory = (title) => {
    switch (title) {
      // Historical Sites
      case 'Kasbah of the Udayas':
        return require('../assets/udaya.png');
      case 'Hassan Tower':
        return require('../assets/hassan.png');
      case 'Chellah Necropolis':
        return require('../assets/chellah.jpeg');
      case 'Royal Palace of Rabat':
        return require('../assets/royal.png');
      case 'Kasbah des Oudaias Gardens':
        return require('../assets/garden.png');
      case 'Mohammed V Mausoleum':
        return require('../assets/mausoleum.png');
      case 'Andalusian Gardens':
        return require('../assets/andalousian.jpg');
      case 'Bab Rouah':
        return require('../assets/bab.png');
      case 'Bab Lamrissa':
        return require('../assets/lamrisa.png');
      case 'Madrasa of Abu al-Hasan':
        return require('../assets/abu.png');
      case 'Bab Lakhmiss':
        return require('../assets/lakhmiss.png');

      // Art Installations
      case 'Mohammed VI Museum of Modern and Contemporary Art':
        return require('../assets/museum.png');
      case 'Museum of History and Civilizations':
        return require('../assets/civil.png');
      case 'The Oudayas Museum':
        return require('../assets/desoudayas.png');
      case 'Gallery Mohamed El Fassi':
        return require('../assets/mohammed.png');
      case 'Musée Belghazi':
        return require('../assets/belghazi.png');
      case 'The National Theatre Mohammed V':
        return require('../assets/national.png');
      case 'Villa des Arts':
        return require('../assets/villa.png');

      // Music Venues
      case 'Jazz au Chellah Festival':
        return require('../assets/jazz.png');
      case 'Riad Kalaa':
        return require('../assets/riad.png');
      case 'Jardin d\'Essais Botaniques':
        return require('../assets/botaniques.jpg');
      case 'Fairmont La Marina':
        return require('../assets/lamarina.png');
      case 'Casa José':
        return require('../assets/casa.png');
      case 'Villa Diyafa':
        return require('../assets/diyafa.png');
      case 'The Jazz Bar':
        return require('../assets/the.png');
      case 'Cinéma Renaissance':
        return require('../assets/renaissance.png');
      case 'The View Hotel':
        return require('../assets/view.png');
      case 'Le Grand Comptoir':
        return require('../assets/comptoir.png');
      case 'La Fête Musicale':
        return require('../assets/fete.png');
      case 'Al Marsa Restaurant':
        return require('../assets/marsa.png');
      case 'Le Dahlia':
        return require('../assets/dahlia.jpg');
      case 'Le Deck':
        return require('../assets/deck.png');
      case 'Le Safran':
        return require('../assets/safran.png');
      case 'Le Vinart':
        return require('../assets/vinart.png');
      case 'La scène OLM Souissi':
        return require('../assets/olm.png');
      case 'Piano Bar Rabat':
        return require('../assets/piano.png');


      // Culinary Hotspots
      // Inside the getImageForCategory function

      case 'Le Dhow Restaurant':
        return require('../assets/dhow.png');
      case 'Riad Meftaha':
        return require('../assets/meftaha.png');
      case 'Riad Shaan':
        return require('../assets/shaan.png');
      case 'Dar Mayssane':
        return require('../assets/mayssane.png');
      case 'Dar Soufa':
        return require('../assets/soufa.png');
      case 'Euphoriad':
        return require('../assets/eupho.png');
      case 'Le Petit Beur':
        return require('../assets/petit.png');
      case 'Le Dinarjat':
        return require('../assets/dinarjat.png');
      case 'Dar Rbatia':
        return require('../assets/dar.png');
      case 'Restaurant Le Ziryab':
        return require('../assets/zriyab.png');
      case 'Dar Naji Agdal':
        return require('../assets/naji.png');
      case 'Dauphin d\'or':
        return require('../assets/dauphin.jpg');
      case 'Dar El Karam Hôtel':
        return require('../assets/elKaram.png');
      case 'Café Museum':
        return require('../assets/museumm.png');
      case 'Helnan Chellah Hotel':
        return require('../assets/helnan.png');
      case 'Café Maure du jardin des Oudayas':
        return require('../assets/maure.png');
      case 'Mgallery Le Diwan':
        return require('../assets/diwan.png');
      case 'Café El Bahia':
        return require('../assets/bahia.jpg');
      case 'Hotel Dar El Kébira':
        return require('../assets/kebira.png');
      case 'Dar Kika Salam By DKS':
        return require('../assets/kika.png');
      case 'La Maison Arabe':
        return require('../assets/maison.png');
      case 'Restaurant Al Warda':
        return require('../assets/warda.png');


      // Default case
      default:
        return require('../assets/icon.png');
    }
  };

  const goToRouting = async (selectedPlace) => {
    console.log("Selected Place:", selectedPlace);
    setIsGoing(true);
    await navigation.navigate('Main', { screen: 'Go', params: { selectedPlace } });
};







  useFocusEffect(
    React.useCallback(() => {
      handlePresentModal();
    }, [])
  );

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.error('Permission to access location was denied');
      return;
    }

    Location.watchPositionAsync({ accuracy: Location.Accuracy.High, timeInterval: 1000 }, location => {
      setInitRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 2,
        longitudeDelta: 2,
      });
      setLoading(false); // Set loading to false after obtaining location
    });
  };

  const filterData = (category) => {
    if (category === selectedCategory) {
      setSelectedCategory(null);
      setFilteredData([]);
    } else {
      setSelectedCategory(category);
      const filtered = data.filter(item => item.type === category);
      setFilteredData(filtered);
    }
  };

  const showAllCategories = () => {
    setSelectedCategory(null);
    setFilteredData([]);
  };

  const getImageForCategory = (category) => {
    switch (category) {
      case 'belghazi.png':
        return require('../assets/belghazi.png');
      case 'art':
        return require('../assets/art.png');
      case 'music':
        return require('../assets/music.png');
      case 'culinary':
        return require('../assets/culinary.png');
      default:
        return require('../assets/icon.png');
    }
  };

  const handleMarkerPress = (place) => {
    setSelectedPlace(place);
    handlePresentModal();
  };

  const renderMarker = (data) => (
    <Marker
      key={data.id}
      coordinate={data.location}
      onPress={() => handleMarkerPress(data)}
    >
      <Image source={getImageForCategory(data.type)} style={{ width: 40, height: 40 }} />
    </Marker>
  );

  const renderInitialRegionMarker = () => {
    if (initRegion) {
      return (
        <Marker
          key="currentLocation"
          coordinate={{
            latitude: initRegion.latitude,
            longitude: initRegion.longitude,
          }}
        >
          <FontAwesome5 name="map-pin" size={24} color="red" />
        </Marker>
      );
    }
  };

  const renderCluster = (cluster, onPress) => (
    <Marker key={`cluster-${cluster.clusterId}`} coordinate={cluster.coordinate} onPress={onPress}>
      <View style={styles.clusterMarker}>
        <Text style={styles.clusterText}>{cluster.pointCount}</Text>
      </View>
    </Marker>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }





  return (
    <BottomSheetModalProvider>
      <View style={styles.container}>
        <ClusteredMapView
          style={styles.map}
          data={selectedCategory ? filteredData : data}
          initialRegion={initRegion}
          renderMarker={renderMarker}
          renderCluster={renderCluster}
        >
          {renderInitialRegionMarker()}
        </ClusteredMapView>
        <View style={styles.overlay}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            horizontal style={styles.filtersContainer}>


            <TouchableOpacity
              onPress={showAllCategories}
              style={[
                styles.filterOption,
                selectedCategory === null ? { backgroundColor: '#d3e3fc' } : { backgroundColor: '#fff' }, // Update background color based on selection
              ]}
            >
              <FontAwesome5
                name="globe"
                size={15}
                color={selectedCategory === null ? '#1b66d0' : '#17294b'} // Update icon color based on selection
                style={styles.filterIcon}
              />
              <Text style={{ color: selectedCategory === null ? '#1b66d0' : '#17294b' }}>All Categories</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => filterData('culinary')}
              style={[
                styles.filterOption,
                selectedCategory === 'culinary' ? { backgroundColor: '#d3e3fc' } : { backgroundColor: '#fff' }, // Update background color based on selection
              ]}
            >
              <FontAwesome5
                name="utensils"
                size={15}
                color={selectedCategory === 'culinary' ? '#1b66d0' : '#17294b'} // Update icon color based on selection
                style={styles.filterIcon}
              />
              <Text style={{ color: selectedCategory === 'culinary' ? '#1b66d0' : '#17294b' }}>Culinary</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => filterData('music')}
              style={[
                styles.filterOption,
                selectedCategory === 'music' ? { backgroundColor: '#d3e3fc' } : { backgroundColor: '#fff' }, // Update background color based on selection
              ]}
            >
              <FontAwesome5
                name="music"
                size={15}
                color={selectedCategory === 'music' ? '#1b66d0' : '#17294b'} // Update icon color based on selection
                style={styles.filterIcon}
              />
              <Text style={{ color: selectedCategory === 'music' ? '#1b66d0' : '#17294b' }}>Music</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => filterData('art')}
              style={[
                styles.filterOption,
                selectedCategory === 'art' ? { backgroundColor: '#d3e3fc' } : { backgroundColor: '#fff' }, // Update background color based on selection
              ]}
            >
              <FontAwesome5
                name="paint-brush"
                size={15}
                color={selectedCategory === 'art' ? '#1b66d0' : '#17294b'} // Update icon color based on selection
                style={styles.filterIcon}
              />
              <Text style={{ color: selectedCategory === 'art' ? '#1b66d0' : '#17294b' }}>Art</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => filterData('historical')}
              style={[
                styles.filterOption,
                selectedCategory === 'historical' ? { backgroundColor: '#d3e3fc' } : { backgroundColor: '#fff' }, // Update background color based on selection
              ]}
            >
              <FontAwesome5
                name="university"
                size={15}
                color={selectedCategory === 'historical' ? '#1b66d0' : '#17294b'} // Update icon color based on selection
                style={styles.filterIcon}
              />
              <Text style={{ color: selectedCategory === 'historical' ? '#1b66d0' : '#17294b' }}>Historical</Text>
            </TouchableOpacity>

          </ScrollView>
        </View>
      </View>
      {selectedPlace ? (
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={snapPoints}
          backgroundStyle={{ borderRadius: 27 }}
        >
          <View style={styles.contentContainer}>
            <View style={styles.rowView}>
              <Text style={styles.title}>{selectedPlace.title}</Text>
              <View style={styles.buttonsView}>
              <SaveButton onPress={() => addToFirebase(selectedPlace)} isSaved={isSaved} />
              <GoButton onPress={() => goToRouting(selectedPlace)} isGoing={isGoing} />
              </View>
            </View>

            <Text>{selectedPlace.description}</Text>

            <Image source={getImageNameForCategory(selectedPlace.title)} style={styles.image2} />








          </View>
        </BottomSheetModal>
      ) : (
        // Default BottomSheetModal
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={snapPoints}
          backgroundStyle={{ borderRadius: 27 }}
        >
          <View style={styles.contentContainer}>
            <Text style={styles.title}>Discover Cultural Locations</Text>
            <Text>Click on the markers to explore various cultural sites such as historical landmarks, art installations, music venues, and culinary hotspots!</Text>
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
                source={require('../assets/image0.jpg')}
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
      )}
    </BottomSheetModalProvider>
  );
}

export const getMyLayersFunction = () => {
  return () => {
    myLayersFunction();
  };
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    paddingHorizontal: 10,
  },
  filtersContainer: {
    borderRadius: 35,
    paddingVertical: 3,
    paddingHorizontal: 5,
    flexDirection: 'row',
  },
  filterOption: {
    marginHorizontal: 5,
    paddingHorizontal: 18,
    borderRadius: 30,
    height: 38,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  filterIcon: {
    marginRight: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clusterMarker: {
    backgroundColor: '#fffffe',
    justifyContent: 'center',
    borderRadius: 55,
    borderColor: '#7fbe96',
    borderWidth: 1,
    height: 35,
    width: 35,
  },
  clusterText: {
    color: '#7fbe96',
    fontSize: 15,
    textAlign: 'center',
  },

  contentContainer: {
    flex: 1,
    marginLeft: 10,
    paddingHorizontal: 15,
  },
  title: {
    fontWeight: "600",
    letterSpacing: 0.5,
    fontSize: 16,
  },
  imageScrollView: {
    flexDirection: 'row',
    marginTop: 10,
    marginRight: 5,
  },
  image: {
    height: 195,
    width: 250,
    borderRadius: 8,
    marginLeft: 10,
  },
  image2: {
    marginTop: 10,
    height: 180,
    width: 315,
    borderRadius: 8,
  },
  rowView:
  {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonsView: 
  {
    flexDirection: 'row',
  }
});
