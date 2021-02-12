import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import {uploadUrl} from '../utils/variables';
import {Avatar, ListItem as RNEListItem} from 'react-native-elements';
import {Button} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useMedia} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import {Alert} from 'react-native';

const ListItem = ({navigation, singleMedia, isMyFile}) => {
  const {deleteFile} = useMedia();
  const {setUpdate, update} = useContext(MainContext);

  const doDelete = () => {
    Alert.alert(
      'Delete',
      'this file permanently?',
      [
        {text: 'Cancel'},
        {
          title: 'Ok',
          onPress: async () => {
            const userToken = await AsyncStorage.getItem('userToken');
            setUpdate(update + 1);
            try {
              await deleteFile(singleMedia.file_id, userToken);
            } catch (error) {
              console.error(error);
            }
          },
        },
      ],
      {
        cancelable: false,
      }
    );
  };

  return (
    <RNEListItem
      bottomDivider
      onPress={() => navigation.navigate('Single', {file: singleMedia})}
    >
      <Avatar
        size="large"
        square
        source={{uri: uploadUrl + singleMedia.thumbnails.w160}}
      ></Avatar>
      <RNEListItem.Content>
        <RNEListItem.Title h4>{singleMedia.title}</RNEListItem.Title>
        <RNEListItem.Subtitle>{singleMedia.description}</RNEListItem.Subtitle>
        {isMyFile && (
          <>
            <Button
              title="View"
              onPress={() => {
                navigation.navigate('Single', {file: singleMedia});
              }}
            ></Button>
            <Button
              title="Modify"
              onPress={() => {
                navigation.push('Modify', {file: singleMedia});
              }}
            ></Button>
            <Button title="Delete" color="red" onPress={doDelete}></Button>
          </>
        )}
      </RNEListItem.Content>
      <RNEListItem.Chevron />
    </RNEListItem>
  );
};

ListItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
  isMyFile: PropTypes.bool,
};

export default ListItem;
