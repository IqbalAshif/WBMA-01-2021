import React, {useState, useEffect, useContext} from 'react';
import {Text, Input, Button} from 'react-native-elements';
import {ScrollView, ActivityIndicator, Alert} from 'react-native';
import useUploadForm from '../hooks/UploadHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useMedia} from '../hooks/ApiHooks';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';

const Modify = ({navigation, route}) => {
  const {
    handleInputChange,
    inputs,
    uploadErrors,
    reset,
    setInputs,
  } = useUploadForm();
  const [isUploading, setIsUploading] = useState(false);
  const {updateFile} = useMedia();
  const {update, setUpdate} = useContext(MainContext);
  const {file} = route.params;

  const doUpdate = async () => {
    try {
      setIsUploading(true);
      const userToken = await AsyncStorage.getItem('userToken');
      const resp = await updateFile(file.file_id, inputs, userToken);
      console.log('update response', resp);
      setUpdate(update + 1);
      navigation.pop();
    } catch (error) {
      Alert.alert('Update', 'Failed');
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    setInputs({
      title: file.title,
      description: file.description,
    });
  }, []);

  const doReset = () => {
    reset();
  };
  return (
    <ScrollView>
      <Text h4>Update file info</Text>

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

      {isUploading && <ActivityIndicator size="large" color="#0000ff" />}
      <Button
        title="Update"
        onPress={doUpdate}
        //   disabled={
        //    uploadErrors.title !== null || uploadErrors.description !== null
        //   }
      />
      <Button title="Reset" onPress={doReset} />
    </ScrollView>
  );
};

Modify.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

export default Modify;
