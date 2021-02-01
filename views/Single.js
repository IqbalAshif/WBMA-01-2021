import React, {useContext, useState, useEffect} from 'react';
import {StyleSheet, ActivityIndicator} from 'react-native';
import PropTypes from 'prop-types';
import {uploadUrl} from '../utils/variables';
import {Avatar, Card, ListItem, Text} from 'react-native-elements';
import moment from 'moment';
import {MainContext} from '../contexts/MainContext';
import {useTag} from '../hooks/ApiHooks';

const Single = ({route}) => {
  const {user} = useContext(MainContext);
  const [avatar, setAvatar] = useState('http://placekitten.com/200/300');
  const {getFilesByTag} = useTag();
  const {file} = route.params;

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const avatarList = await getFilesByTag('avatar_' + user.user_id);
        if (avatarList.length > 0) {
          setAvatar(uploadUrl + avatarList.pop().filename);
        }
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchAvatar();
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
        <Text>{user.full_name}</Text>
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
