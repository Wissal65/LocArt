import { FontAwesome5 } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, Image , StyleSheet,TouchableOpacity } from 'react-native';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import markerData from '../data/data.json'; // Import JSON data directly
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

export default function SavedScreen({ route }) {


  const { auth, db } = route.params;

  const [savedLocations, setSavedLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const [expandedStates, setExpandedStates] = useState({});

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const unsubscribe = onSnapshot(
        query(collection(db, "favoritemarkers"), where("userid", "==", user.uid)),
        (snapshot) => {
          const locations = [];
          snapshot.forEach((doc) => {
            locations.push({ id: doc.id, ...doc.data() });
          });
          setSavedLocations(locations);
          setLoading(false);
        }
      );

      return () => {
        // Unsubscribe from the snapshot listener when the component unmounts
        unsubscribe();
      };
    }
  }, [db, auth]);
  
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

//   const goToRouting2 = async (item) => {
//     console.log("Selected Place:", item);
//     await navigation.navigate('Main', { screen: 'Go', params: { item } });
// };


  const toggleExpansion = (itemId) => {
    setExpandedStates(prevState => ({
      ...prevState,
      [itemId]: !prevState[itemId]
    }));
  };

  const isExpanded = (itemId) => {
    return expandedStates[itemId] || false;
  };
  
  const renderItem = ({ item }) => {
    const additionalInfo = markerData.historicalSites.find(site => site.id === item.id)
      || markerData.artInstallations.find(site => site.id === item.id) 
      || markerData.culinaryHotspots.find(site => site.id === item.id) 
      || markerData.musicVenues.find(site => site.id === item.id);
  
    const description = isExpanded(item.id) ? additionalInfo.description : additionalInfo.description.substring(0, 150) + '...';
    const showSeeMore = !isExpanded(item.id);
  
    return (
      <View>
        <TouchableOpacity style={styles.listItem} >        
        <View style={styles.contentContainer}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', bottom: 2 }}>{item.title}</Text>
          <Text>{description}</Text>
          {showSeeMore && (
            <TouchableOpacity onPress={() => toggleExpansion(item.id)}>
              <Text style={styles.readMore}>See More</Text>
            </TouchableOpacity>
          )}
          {!showSeeMore && (
            <TouchableOpacity onPress={() => toggleExpansion(item.id)}>
              <Text style={styles.readMore}>See Less</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.imageContainer}>
          <Image source={getImageNameForCategory(additionalInfo.title)} resizeMode='cover' style={{ width: 100, height: 110, borderRadius: 5 }} />
        </View>
        </TouchableOpacity>
      </View>
    );
  };
  

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.favoritesContainer}>
        <View style={styles.favoritesInsideContainer}>
          <FontAwesome5 name="heart" size={20} color="#d22484" />
          <Text style={styles.favoritesText}>Favorite places</Text>
        </View>
      </View>

      {savedLocations.length === 0 ? (
        <Text>No saved locations found.</Text>
      ) : (
        <FlatList
          style={styles.flatlist}
          data={savedLocations}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
    marginTop: 30,
  },
  favoritesContainer:
  {
    flexDirection: 'row',
    margin: 10,
    justifyContent: 'space-between',
  },
  favoritesInsideContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  favoritesText:
  {
    marginLeft: 10,
  },
  listItem:
  {
    flexDirection : 'row',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    justifyContent : 'center',

  },
  listItemText : 
  {
    marginLeft:10,
    fontWeight: 'bold',
    fontSize:50,
  },
  goButton: 
  {
    marginLeft:'auto',
  },
  contentContainer: {
    flex: 1,
   
  },
  imageContainer: {
    marginLeft: 'auto',
    width: 80, 
    height:80,
    borderRadius:40,
        // resizeMode: 'cover', // Ensure the entire image is visible within the container
            // Set the aspect ratio (width:height)
  },
  readMore:{
    fontSize:12,
    color: 'grey',

  }
});