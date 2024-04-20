import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BottomSheetModal, BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useRef } from "react";
import BottomSheetContent from '../components/BottomSheet';

const BottomMenu = () => {
  const navigation = useNavigation();
  const [selectedIcon, setSelectedIcon] = useState('explore');
  // const [bottomSheetVisible, setBottomSheetVisible] = useState(false);

  const bottomSheetModalRef = useRef(null);
  const snapPoints = ["25%", "48%", "75%"];

  function handlePresentModal() {
    bottomSheetModalRef.current?.present();

  }

  const handleIconPress = (iconName) => {
    setSelectedIcon(iconName);
    switch (iconName) {
      case 'explore':
        navigation.navigate('Main', { screen: 'Map' });
        break;
      case 'transport':
        navigation.navigate('Main', { screen: 'Transport' });
        break;
      case 'saved':
        navigation.navigate('Main', { screen: 'Saved' });
        break;
      case 'layers':
        navigation.navigate('Main', { screen: 'Layers' });
        break;
      case 'settings':
        navigation.navigate('Settings');
        break;
      default:
        break;
    }
    handlePresentModal(); // Move this line here
  };
  

  return (
    <View style={styles.bottomContainer}>

      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={snapPoints}
          backgroundStyle={{ borderRadius: 50 }}
        >
          <View style={styles.contentContainer}>
            <Text style={styles.title}>hello world</Text>

          </View>
        </BottomSheetModal>
      </BottomSheetModalProvider>

      <View style={styles.bottomMenu}>
        <TouchableOpacity style={styles.menuItem} onPress={() => handleIconPress('explore')}>
          <FontAwesome name="map-marker" size={27} color={selectedIcon === 'explore' ? "#0951bd" : "#5f6062"} />
          <Text style={{ color: selectedIcon === 'explore' ? "#0951bd" : "#5f6062", paddingTop: 5 }}>Explore</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => handleIconPress('transport')}>
          <FontAwesome name="bus" size={24} color={selectedIcon === 'transport' ? "#0951bd" : "#5f6062"} />
          <Text style={{ color: selectedIcon === 'transport' ? "#0951bd" : "#5f6062", paddingTop: 5 }}>Go</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => handleIconPress('saved')}>
          <FontAwesome name="bookmark" size={24} color={selectedIcon === 'saved' ? "#0951bd" : "#5f6062"} />
          <Text style={{ color: selectedIcon === 'saved' ? "#0951bd" : "#5f6062", paddingTop: 5 }}>Saved</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => handleIconPress('layers')}>
          <FontAwesome name="map" size={23} color={selectedIcon === 'layers' ? "#0951bd" : "#5f6062"} />
          <Text style={{ color: selectedIcon === 'layers' ? "#0951bd" : "#5f6062", paddingTop: 5 }}>Layers</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => handleIconPress('settings')}>
          <FontAwesome name="cog" size={26} color={selectedIcon === 'settings' ? "#0951bd" : "#5f6062"} />
          <Text style={{ color: selectedIcon === 'settings' ? "#0951bd" : "#5f6062", paddingTop: 5 }}>Settings</Text>
        </TouchableOpacity>
      </View>
      
    </View>

  );
};

const styles = {
  bottomContainer: {
    flex: 1,
    position: 'relative', // Make sure the container is positioned relatively
  },
  bottomMenu: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 5,
    elevation: 6,
    width: '100%',
    bottom: 0,
    alignSelf: 'center',
    zIndex: 1, // Ensure bottom menu is above other content
  },
  menuItem: {
    alignItems: 'center',
    padding: 10,
  },
  contentContainer: {
    position: 'absolute',
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 15,
    bottom: 0, // Align content to the bottom
    width: '100%', // Ensure content covers the entire width
    zIndex: 2, // Ensure content is above bottom menu
  },
  title: {
    fontWeight: "900",
    letterSpacing: 0.5,
    fontSize: 16,
  },
  
};

export default BottomMenu;
