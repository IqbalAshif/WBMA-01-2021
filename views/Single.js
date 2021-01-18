import React from 'react';
import {Image, StyleSheet, SafeAreaView, Text} from 'react-native';
import PropTypes from 'prop-types';
import {uploadUrl} from '../utils/variables';

const Single = ({route}) => {
  const {file} = route.params;
  return (
    <SafeAreaView style={styles.container}>
      <Text>{file.title}</Text>
      <Image
        source={{uri: uploadUrl + file.filename}}
        style={{width: '90%', height: '80%'}}
        resizeMode="contain"
      />
    </SafeAreaView>
  );
};
Single.propTypes = {
  route: PropTypes.object,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
});

export default Single;
