import {useState} from 'react';
import {useUser} from './ApiHooks';

const useSignUpForm = (callback) => {
  const [usernameError, setUserNameError] = useState('');
  const {checkIfUserIsAvailable} = useUser();
  const [inputs, setInputs] = useState({
    username: '',
    password: '',
    email: '',
    full_name: '',
  });

  const handleInputChange = (name, text) => {
    console.log(name, text);
    setInputs((inputs) => {
      return {
        ...inputs,
        [name]: text,
      };
    });
  };

  const checkUserAvailability = async (event) => {
    try {
      const result = await checkIfUserIsAvailable(event.nativeEvent.text);
      if (!result) {
        setUserNameError('Username already exists');
      } else {
        setUserNameError('');
      }
    } catch (error) {
      console.log('reg checkIfUserIsAvailable', error);
    }
  };

  return {
    handleInputChange,
    inputs,
    usernameError,
    checkUserAvailability,
  };
};

export default useSignUpForm;
