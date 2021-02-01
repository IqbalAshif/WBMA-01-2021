import React, {useState, useEffect} from 'react';
import {StyleSheet, ActivityIndicator} from 'react-native';
import PropTypes from 'prop-types';
import {uploadUrl} from '../utils/variables';
import {Avatar, Card, ListItem, Text} from 'react-native-elements';
import moment from 'moment';
import {useTag, useUser} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Single = ({route}) => {
  const [avatar, setAvatar] = useState('http://placekitten.com/200/300');
  const {getFilesByTag} = useTag();
  const {file} = route.params;
  const {getUserById} = useUser();
  const [owner, setOwner] = useState('Somebody');

  useEffect(() => {
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
    fetchAvatar();
    getUserInfo();
  }, []);

  return (
    <Card>
      <Card.Title h4>{file.title}</Card.Title>
      <Card.Title>{moment(file.tome_added).format('LLL')}</Card.Title>
      <Card.Divider />
      <Card.Image
        source={{uri: uploadUrl + file.filename}}
        style={styles.image}
        PlaceholderContent={<ActivityIndicator />}
      />
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
