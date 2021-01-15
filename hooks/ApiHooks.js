import {useState, useEffect} from 'react';

const apiUrl = 'http://media.mw.metropolia.fi/wbma/';

const useLoadMedia = () => {
  // TODO: move mediaArray state here
  const [mediaArray, setMediaArray] = useState([]);
  // TODO: move loadMedia function here
  const loadMedia = async (limit = 5) => {
    try {
      const listResponse = await fetch(apiUrl + 'media?limit=' + limit);
      const listJson = await listResponse.json();
      console.log('response json data', listJson);

      const media = await Promise.all(
        listJson.map(async (item) => {
          const fileResponse = await fetch(apiUrl + 'media/' + item.file_id);
          const fileJson = await fileResponse.json();
          return fileJson;
        })
      );
      console.log('media array data', media);
      setMediaArray(media);
    } catch (error) {
      console.error('loadMedia error', error);
    }
  };
  // TODO: move useEffect here
  useEffect(() => {
    loadMedia(3);
  }, []);

  return mediaArray;
};

export {useLoadMedia};
