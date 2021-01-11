import {StatusBar} from 'expo-status-bar';
import React from 'react';
import {SafeAreaView} from 'react-native';
import GlobalStyles from './GlobalStyles';

import List from './components/List';

const App = () => {
  return (
    <SafeAreaView style={GlobalStyles.droidSafeArea}>
      <List />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

export default App;
