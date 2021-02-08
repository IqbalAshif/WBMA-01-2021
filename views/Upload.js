import React, {useState, useEffect, useContext} from 'react';
import {Text, Image, Input, Button} from 'react-native-elements';
import {Platform, ScrollView, ActivityIndicator, Alert} from 'react-native';
import useUploadForm from '../hooks/UploadHooks';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useMedia, useTag} from '../hooks/ApiHooks';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import {appIdentifier} from '../utils/variables';
import {Video} from 'expo-av';

const Upload = ({navigation}) => {
  const {handleInputChange, inputs, uploadErrors, reset} = useUploadForm();
  const [image, setImage] = useState(null);
  const [fileType, setFileType] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const {upload} = useMedia();
  const {update, setUpdate} = useContext(MainContext);
  const {postTag} = useTag();

  const doUpload = async () => {
    const formData = new FormData();
    // add text to form data
    formData.append('title', inputs.title);
    formData.append('description', inputs.description);
    // add image to form data
    const filename = image.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    let type = match ? `${fileType}/${match[1]}` : fileType;
    if (type === 'image/jpg') type = 'image/jpeg';

    formData.append('file', {
      uri: image,
      name: filename,
      type: type,
    });

    try {
      setIsUploading(true);
      const userToken = await AsyncStorage.getItem('userToken');
      const resp = await upload(formData, userToken);
      console.log('upload response', resp);
      const tagResponse = await postTag(
        {
          file_id: resp.file_id,
          tag: appIdentifier,
        },
        userToken
      );
      console.log('posting app identifier', tagResponse);
      Alert.alert(
        'Upload',
        'File uploaded',
        [
          {
            text: 'Ok',
            onPress: () => {
              setUpdate(update + 1);
              doReset();
              navigation.navigate('Home');
            },
          },
        ],
        {cancelable: false}
      );
    } catch (error) {
      Alert.alert('Upload', 'Failed');
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const {
          status,
        } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  const pickImage = async (library) => {
    let result = null;
    const options = {
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    };

    if (library) {
      result = await ImagePicker.launchImageLibraryAsync(options);
    } else {
      result = await ImagePicker.launchCameraAsync(options);
    }

    console.log(result);

    if (!result.cancelled) {
      setFileType(result.type);
      setImage(result.uri);
    }
  };

  const doReset = () => {
    setImage(null);
    reset();
  };
  return (
    <ScrollView>
      <Text h4>Upload Media file</Text>
      {image && (
        <>
          {fileType === 'image' ? (
            <Image
              source={{uri: image}}
              style={{width: '100%', height: undefined, aspectRatio: 1}}
            />
          ) : (
            <Video
              source={{uri: image}}
              style={{width: '100%', height: undefined, aspectRatio: 1}}
              useNativeControls={true}
            />
          )}
        </>
      )}
      <Input
        placeholder="title"
        value={inputs.title}
        onChangeText={(txt) => handleInputChange('title', txt)}
        errorMessage={uploadErrors.title}
      />
      <Input
        placeholder="description"
        value={inputs.description}
        onChangeText={(txt) => handleInputChange('description', txt)}
        errorMessage={uploadErrors.description}
      />
      <Button title="Choose File" onPress={() => pickImage(true)} />
      <Button title="Use camera" onPress={() => pickImage(false)} />
      {isUploading && <ActivityIndicator size="large" color="#0000ff" />}
      <Button
        title="Upload File"
        onPress={doUpload}
        disabled={
          uploadErrors.title !== null ||
          uploadErrors.description !== null ||
          image === null
        }
      />
      <Button title="Reset" onPress={doReset} />
    </ScrollView>
  );
};

Upload.propTypes = {
  navigation: PropTypes.object,
};

export default Upload;
