import React from 'react';
import {View, Button} from 'react-native';
import useLoginForm from '../hooks/loginHooks';
import FormTextInput from './FormTextInput';
import PropTypes from 'prop-types';

const LoginForm = ({navigation}) => {
  const {inputs, handleInputChange} = useLoginForm();
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
      {/* <Button title="Register!" onPress={doRegister} /> */}
    </View>
  );
};

LoginForm.propTypes = {
  navigation: PropTypes.object,
};

export default LoginForm;
