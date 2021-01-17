import {StatusBar} from 'expo-status-bar';
import React from 'react';
import {
  FlatList,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  View,
} from 'react-native';
import {Menu, Settings} from 'react-native-feather';
import GlobalStyles from './GlobalStyles';

const mediaArray = [
  {
    key: '0',
    title: 'Title 1',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sodales enim eget leo condimentum vulputate. Sed lacinia consectetur fermentum. Vestibulum lobortis purus id nisi mattis posuere. Praesent sagittis justo quis nibh ullamcorper, eget elementum lorem consectetur. Pellentesque eu consequat justo, eu sodales eros.',
    thumbnails: {
      w160: 'http://placekitten.com/160/161',
    },
    filename: 'http://placekitten.com/2048/1920',
  },
  {
    key: '1',
    title: 'Title 2',
    description:
      'Donec dignissim tincidunt nisl, non scelerisque massa pharetra ut. Sed vel velit ante. Aenean quis viverra magna. Praesent eget cursus urna. Ut rhoncus interdum dolor non tincidunt. Sed vehicula consequat facilisis. Pellentesque pulvinar sem nisl, ac vestibulum erat rhoncus id. Vestibulum tincidunt sapien eu ipsum tincidunt pulvinar. ',
    thumbnails: {
      w160: 'http://placekitten.com/160/164',
    },
    filename: 'http://placekitten.com/2041/1922',
  },
  {
    key: '2',
    title: 'Title 3',
    description:
      'Phasellus imperdiet nunc tincidunt molestie vestibulum. Donec dictum suscipit nibh. Sed vel velit ante. Aenean quis viverra magna. Praesent eget cursus urna. Ut rhoncus interdum dolor non tincidunt. Sed vehicula consequat facilisis. Pellentesque pulvinar sem nisl, ac vestibulum erat rhoncus id. ',
    thumbnails: {
      w160: 'http://placekitten.com/160/167',
    },
    filename: 'http://placekitten.com/2039/1920',
  },
];

const Flexboxdemo = () => {
  return (
    <SafeAreaView style={GlobalStyles.droidSafeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <ImageBackground
            source={require('./assets/c.jpg')}
            style={styles.bgImage}
            imageStyle={{borderBottomRightRadius: 65}}
          ></ImageBackground>
          <Menu
            stroke="white"
            width={32}
            height={32}
            style={styles.menu}
          ></Menu>
          <Settings
            stroke="white"
            width={32}
            height={32}
            style={styles.setting}
          ></Settings>
          <Text style={styles.hello}>Hello Stranger, hope you are okay.</Text>
        </View>
        <View style={styles.infoArea}>
          <View style={styles.areaA}>
            <Text>Cool Kittens</Text>
          </View>
          <View style={styles.areaB}>
            <FlatList
              horizontal={true}
              data={mediaArray}
              renderItem={({item}) => {
                return (
                  <TouchableOpacity>
                    <Image
                      style={{width: 100, height: 100}}
                      source={{uri: item.thumbnails.w160}}
                    />
                    <View style={styles.contento}>
                      <Text>{item.title}</Text>
                      <Text>{item.description}</Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
        <View style={styles.footerArea} />
        <StatusBar backgroundColor="aquamarine" barStyle="light" />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    backgroundColor: 'yellow',
    height: '100%',
    paddingTop: 0,
  },
  header: {
    height: 270,
    backgroundColor: 'powderblue',
  },
  bgImage: {
    width: '100%',
    height: 270,
  },
  menu: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  setting: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  hello: {
    position: 'absolute',
    left: 20,
    bottom: 40,
    color: 'white',
  },
  infoArea: {
    flex: 6,
    flexDirection: 'column',
    backgroundColor: 'skyblue',
  },
  areaA: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'pink',
  },
  areaB: {
    flex: 8,
    backgroundColor: 'green',
    padding: 20,
  },
  footerArea: {
    flex: 1,
    backgroundColor: 'steelblue',
  },
});

export default Flexboxdemo;
