import {useState, useEffect} from 'react';

import {apiUrl} from '../utils/variables';

const doFetch = async (url, options = {}) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error('doFetch failed');
  }
  return await response.json();
};

const useLoadMedia = () => {
  // TODO: move mediaArray state here
  const [mediaArray, setMediaArray] = useState([]);
  // TODO: move loadMedia function here
  const loadMedia = async (limit = 5) => {
    try {
      const listResponse = await fetch(apiUrl + 'media?limit=' + limit);
      const listJson = await listResponse.json();

      const media = await Promise.all(
        listJson.map(async (item) => {
          const fileResponse = await fetch(apiUrl + 'media/' + item.file_id);
          const fileJson = await fileResponse.json();
          return fileJson;
        })
      );

      setMediaArray(media);
    } catch (error) {
      console.error('loadMedia error', error);
    }
  };
  // TODO: move useEffect here
  useEffect(() => {
    loadMedia(10);
  }, []);

  return mediaArray;
};
const useLogin = () => {
  const postLogin = async (userCredentials) => {
    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(userCredentials),
    };
    try {
      const userData = await doFetch(apiUrl + 'login', options);
      return userData;
    } catch (error) {
      throw new Error(error.message);
    }
  };
  return {postLogin};
};

const useUser = () => {
  const postRegister = async (inputs) => {
    console.log('trying to create user', inputs);
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inputs),
    };
    try {
      const response = await fetch(apiUrl + 'users', fetchOptions);
      const json = await response.json();
      console.log('register resp', json);
      if (response.ok) {
        return json;
      } else {
        throw new Error(json.message + ': ' + json.error);
      }
    } catch (e) {
      console.log('ApiHooks register', e.message);
      throw new Error(e.message);
    }
  };
  const checkToken = async (token) => {
    try {
      const options = {
        method: 'GET',
        headers: {'x-access-token': token},
      };
      const response = await fetch(apiUrl + 'users/user', options);
      const userData = await response.json();
      if (response.ok) {
        return userData;
      } else {
        throw new Error(userData.message);
      }
    } catch (error) {
      throw new Error(error.message);
    }
  };
  return {postRegister, checkToken};
};

export {useLoadMedia, useLogin, useUser};