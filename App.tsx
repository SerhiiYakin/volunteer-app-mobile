import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  useColorScheme,
} from 'react-native';
import Navigation from './Navigation';



function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';




  return (
    <SafeAreaView style={styles.container}>
      <Navigation/>
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:'rgba(245, 241, 228, 1)'
  },
});

export default App;
