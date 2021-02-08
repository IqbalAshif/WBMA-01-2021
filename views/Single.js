import React, {useState, useEffect} from 'react';
import {StyleSheet, ActivityIndicator} from 'react-native';
import PropTypes from 'prop-types';
import {uploadUrl} from '../utils/variables';
import {Avatar, Card, ListItem, Text} from 'react-native-elements';
import moment from 'moment';
import {useTag, useUser} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Video} from 'expo-av';
import * as ScreenOrientation from 'expo-screen-orientation';

const Single = ({route}) => {
  const [avatar, setAvatar] = useState('http://placekitten.com/200/300');
  const {getFilesByTag} = useTag();
  const {file} = route.params;
  const {getUserById} = useUser();
  const [owner, setOwner] = useState('Somebody');
  const [videoRef, setVideoref] = useState(null);

  const fetchAvatar = async () => {
    try {
      const avatarList = await getFilesByTag('avatar_' + file.user_id);
      if (avatarList.length > 0) {
        setAvatar(uploadUrl + avatarList.pop().filename);
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  const getUserInfo = async () => {
    const token = await AsyncStorage.getItem('userToken');
    try {
      const user = await getUserById(file.user_id, token);
      setOwner(user.username);
    } catch (e) {
      console.error(e.message);
    }
  };
  const unlock = async () => {
    try {
      await ScreenOrientation.unlockAsync();
    } catch (error) {
      console.error('unlock', error.message);
    }
  };

  const lock = async () => {
    try {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP
      );
    } catch (error) {
      console.error('lock', error.message);
    }
  };

  const handleVideoRef = (component) => {
    setVideoref(component);
  };

  const showVideoFullScreen = async () => {
    try {
      if (videoRef) await videoRef.presentFullscreenPlayer();
    } catch (error) {
      console.error('fullscreen', error.message);
    }
  };

  useEffect(() => {
    unlock();
    fetchAvatar();
    getUserInfo();

    const orientSub = ScreenOrientation.addOrientationChangeListener((evt) => {
      console.log('orientation', evt);
      if (evt.orientationInfo.orientation > 2) {
        // show video in fullscreen
        showVideoFullScreen();
      }
    });

    return () => {
      ScreenOrientation.removeOrientationChangeListener(orientSub);
      lock();
    };
  }, [videoRef]);

  return (
    <Card>
      <Card.Title h4>{file.title}</Card.Title>
      <Card.Title>{moment(file.time_added).format('LLL')}</Card.Title>
      <Card.Divider />

      {file.media_type === 'image' ? (
        <Card.Image
          source={{uri: uploadUrl + file.filename}}
          style={styles.image}
          PlaceholderContent={<ActivityIndicator />}
        />
      ) : (
        <Video
          ref={handleVideoRef}
          source={{uri: uploadUrl + file.filename}}
          style={styles.image}
          useNativeControls={true}
          resizeMode="cover"
          onError={(err) => {
            console.error('video', err);
          }}
          posterSource={{uri: uploadUrl + file.screenshot}}
        />
      )}

      <Card.Divider />
      <Text style={styles.description}>{file.description}</Text>
      <ListItem>
        <Avatar source={{uri: avatar}} />
        <Text>{owner}</Text>
      </ListItem>
    </Card>
  );
};
Single.propTypes = {
  route: PropTypes.object,
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
  },
  description: {
    marginBottom: 10,
  },
});

Single.propTypes = {
  route: PropTypes.object,
};

export default Single;
