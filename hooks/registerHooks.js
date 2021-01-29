import {useState} from 'react';
import {validator} from '../utils/validator';
import {useUser} from './ApiHooks';

const constraints = {
  username: {
    presence: {
      message: 'Cannot be empty',
    },
    length: {
      minimum: 3,
      message: 'min length is 3 characters',
    },
  },
  password: {
    presence: {
      message: 'Cannot be empty',
    },
    length: {
      minimum: 5,
      message: 'min length is 5 characters',
    },
  },
  confirmPassword: {
    equality: 'password',
  },
  email: {
    presence: {
      message: 'Cannot be empty',
    },
    email: {
      message: 'Please enter a valid email',
    },
  },
  full_name: {
    length: {
      minimum: 5,
      message: 'min length is 5 characters',
    },
  },
};

const useSignUpForm = (callback) => {
  const [registerErrors, setRegisterErrors] = useState({});
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

  const handleInputEnd = (name, text) => {
    console.log('input end text', text);
    if (text === '') {
      text = null;
    }

    let error;
    if (name === 'confirmPassword') {
      error = validator(
        name,
        {
          password: inputs.password,
          confirmPassword: text,
        },
        constraints
      );
    } else {
      error = validator(name, text, constraints);
    }

    setRegisterErrors((registerErrors) => {
      return {
        ...registerErrors,
        [name]: error,
      };
    });
  };

  const checkUserAvailability = async (event) => {
    try {
      const result = await checkIfUserIsAvailable(event.nativeEvent.text);
      if (!result) {
        // setUserNameError('Username already exists');
        setRegisterErrors((registerErrors) => {
          return {
            ...registerErrors,
            username: 'Username exists. Pick a new one.',
          };
        });
      } else {
        // setUserNameError('');
      }
    } catch (error) {
      console.log('reg checkIfUserIsAvailable', error);
    }
  };

  const validateOnSend = () => {
    const usernameError = validator('username', inputs.username, constraints);
    const passwordError = validator('password', inputs.password, constraints);
    const confirmPasswordError = validator(
      'confirmPassword',
      {
        password: inputs.password,
        confirmPassword: inputs.confirmPassword,
      },
      constraints
    );
    const emailError = validator('email', inputs.email, constraints);
    const fullnameError = validator('full_name', inputs.full_name, constraints);

    setRegisterErrors((registerErrors) => {
      return {
        ...registerErrors,
        username: usernameError,
        password: passwordError,
        confirmPassword: confirmPasswordError,
        email: emailError,
        full_name: fullnameError,
      };
    });
    if (
      usernameError !== null ||
      passwordError !== null ||
      confirmPasswordError !== null ||
      emailError !== null ||
      fullnameError != null
    ) {
      return false;
    }
    return true;
  };

  return {
    handleInputChange,
    inputs,
    checkUserAvailability,
    registerErrors,
    handleInputEnd,
    validateOnSend,
  };
};

export default useSignUpForm;
