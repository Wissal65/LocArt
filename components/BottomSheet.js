// BottomSheetContent.js
import React from 'react';
import { View, Text } from 'react-native';
import "react-native-gesture-handler";
import { BottomSheetModal, BottomSheetModalProvider, } from "@gorhom/bottom-sheet";
import { useRef } from "react";
import MapScreenContent from './MapScreenContent';
import TransportScreenContent from './TransportScreenContent';


const BottomSheetContent = ({ screen }) => {

  const bottomSheetModalRef = useRef(null);
  const snapPoints = ["25%", "48%" , "75%"];

  
  let content;
  
  switch (screen) {
    case 'Map':
      content = <MapScreenContent />;
      break;
    case 'Transport':
      content = <TransportScreenContent />;
      break;
    // Add cases for other screens as needed
    default:
      content = null;
  }

  return (
    <BottomSheetModalProvider>
    <View>
      <BottomSheetModal
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={snapPoints}
          backgroundStyle={{borderRadius: 50}}
        >
          <View style={styles.contentContainer}>
            <Text style={styles.title}>hello world</Text>
          
          </View>
        </BottomSheetModal>
    </View>
    </BottomSheetModalProvider>
  );
};

export default BottomSheetContent;