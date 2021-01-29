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
  const {
    inputs,
    handleInputChange,
    registerErrors,
    checkUserAvailability,
    handleInputEnd,
    validateOnSend,
  } = useSignUpForm();
  const {postRegister} = useUser();
  const {postLogin} = useLogin();

  const doRegister = async () => {
    try {
      if (!validateOnSend()) {
        Alert.alert('Input validation failed!');
        console.log('validateOnSend failed');
        return;
      }
      delete inputs.confirmPassword;
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
        onEndEditing={(event) => {
          checkUserAvailability(event);
          handleInputEnd('username', event.nativeEvent.text);
        }}
        errorMessage={registerErrors.username}
      />
      <FormTextInput
        autoCapitalize="none"
        placeholder="password"
        onChangeText={(txt) => handleInputChange('password', txt)}
        onEndEditing={(event) =>
          handleInputEnd('password', event.nativeEvent.text)
        }
        secureTextEntry={true}
        errorMessage={registerErrors.password}
      />
      <FormTextInput
        autoCapitalize="none"
        placeholder="confirm password"
        onChangeText={(txt) => handleInputChange('confirmPassword', txt)}
        onEndEditing={(event) =>
          handleInputEnd('confirmPassword', event.nativeEvent.text)
        }
        secureTextEntry={true}
        errorMessage={registerErrors.confirmPassword}
      />
      <FormTextInput
        autoCapitalize="none"
        placeholder="email"
        onChangeText={(txt) => handleInputChange('email', txt)}
        onEndEditing={(event) => {
          handleInputChange('email', event.nativeEvent.text);
        }}
        errorMessage={registerErrors.email}
      />
      <FormTextInput
        autoCapitalize="none"
        placeholder="full name"
        onChangeText={(txt) => handleInputChange('full_name', txt)}
        onEndEditing={(event) =>
          handleInputEnd('full_name', event.nativeEvent.text)
        }
        errorMessage={registerErrors.full_name}
      />
      <Button title="Register!" onPress={doRegister} />
    </View>
  );
};

RegisterForm.propTypes = {
  navigation: PropTypes.object,
};

export default RegisterForm;
