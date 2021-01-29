import {useState, useEffect} from 'react';

import {apiUrl} from '../utils/variables';

// general function for fetching (options default value is empty object)
const doFetch = async (url, options = {}) => {
  const response = await fetch(url, options);
  const json = await response.json();
  if (json.error) {
    // if API response contains error message (use Postman to get further details)
    throw new Error(json.message + ': ' + json.error);
  } else if (!response.ok) {
    // if API response does not contain error message, but there is some other error
    throw new Error('doFetch failed');
  } else {
    // if all goes well
    return json;
  }
};
const useLoadMedia = () => {
  const [mediaArray, setMediaArray] = useState([]);
  const loadMedia = async (limit = 5) => {
    try {
      const listJson = await doFetch(apiUrl + 'media?limit=' + limit);

      const media = await Promise.all(
        listJson.map(async (item) => {
          const fileJson = await doFetch(apiUrl + 'media/' + item.file_id);
          return fileJson;
        })
      );
      setMediaArray(media);
    } catch (error) {
      console.error('loadMedia error', error.message);
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
      throw new Error('postLogin error: ' + error.message);
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
      const json = await doFetch(apiUrl + 'users', fetchOptions);
      console.log('register resp', json);
      return json;
    } catch (e) {
      throw new Error(e.message);
    }
  };

  const checkToken = async (token) => {
    try {
      const options = {
        method: 'GET',
        headers: {'x-access-token': token},
      };
      const userData = await doFetch(apiUrl + 'users/user', options);
      return userData;
    } catch (error) {
      throw new Error(error.message);
    }
  };
  const checkIfUserIsAvailable = async (username) => {
    try {
      const result = await doFetch(apiUrl + 'users/username/' + username);
      return result.available;
    } catch (error) {
      throw new Error('apiHooks checkIfUserIsAvailable', error.message);
    }
  };

  return {postRegister, checkToken, checkIfUserIsAvailable};
};

const useTag = () => {
  const getFilesByTag = async (tag) => {
    try {
      const tagList = await doFetch(apiUrl + 'tags/' + tag);
      return tagList;
    } catch (error) {
      throw new Error(error.message);
    }
  };
  return {getFilesByTag};
};

export {useLoadMedia, useLogin, useUser, useTag};
