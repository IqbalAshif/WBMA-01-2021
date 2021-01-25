import React, {useContext} from 'react';
import {View, Button, Alert} from 'react-native';
import useSignUpForm from '../hooks/registerHooks';
import FormTextInput from './FormTextInput';
import PropTypes from 'prop-types';
import {useLogin, useUser} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../contexts/MainContext';

const RegisterForm = ({navigation}) => {
  const {setIsLoggedIn, setUser} = useContext(MainContext);
  const {inputs, handleInputChange} = useSignUpForm();
  const {postRegister} = useUser();
  const {postLogin} = useLogin();

  const doRegister = async () => {
    try {
      const result = await postRegister(inputs);
      console.log('doRegister ok', result.message);
      Alert.alert(result.message);
      //  automatic login, store taken etc
      const userData = await postLogin(inputs);
      await AsyncStorage.setItem('userToken', userData.token);
      setIsLoggedIn(true);
      setUser(userData.user);
    } catch (error) {
      console.log('registration error', error);
      Alert.alert(error.message);
    }
  };

  return (
    <View>
      <FormTextInput
        autoCapitalize="none"
        placeholder="username"
        onChangeText={(txt) => handleInputChange('username', txt)}
      />
      <FormTextInput
        autoCapitalize="none"
        placeholder="password"
        onChangeText={(txt) => handleInputChange('password', txt)}
        secureTextEntry={true}
      />
      <FormTextInput
        autoCapitalize="none"
        placeholder="email"
        onChangeText={(txt) => handleInputChange('email', txt)}
      />
      <FormTextInput
        autoCapitalize="none"
        placeholder="full name"
        onChangeText={(txt) => handleInputChange('full_name', txt)}
      />
      <Button title="Register!" onPress={doRegister} />
    </View>
  );
};

RegisterForm.propTypes = {
  navigation: PropTypes.object,
};

export default RegisterForm;
