import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import HomeScreen from './screens/HomeScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import {ImageProvider} from './context/ImageContext';
import {FavoritesProvider} from './context/FavoritesContext';

const {width: screenWidth} = Dimensions.get('window');

const App = () => {
  const [currentPage, setCurrentPage] = useState(0); // 0: Home, 1: Favorites
  const scrollViewRef = useRef(null);

  const navigateToPage = (pageIndex) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: pageIndex * screenWidth,
        animated: true,
      });
    }
    setCurrentPage(pageIndex);
  };

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={styles.container}>
        <StatusBar hidden={true} />
        <ImageProvider>
          <FavoritesProvider>
            <View style={styles.container}>
              {currentPage === 0 ? (
                <HomeScreen onSwipeLeft={() => navigateToPage(1)} />
              ) : (
                <FavoritesScreen onSwipeRight={() => navigateToPage(0)} />
              )}
            </View>
            <Toast />
          </FavoritesProvider>
        </ImageProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});

export default App;