import { useState, useEffect, useContext } from 'react';
import StorageContext from '../contexts/StorageContext';
import useCurrentLocation from './useCurrentLocation';

import { sortByDistances, calculateDistance } from '../utils';

const useMessages = () => {
  const storage = useContext(StorageContext);
  const [currentLocation] = useCurrentLocation();
  const [messages, setMessages] = useState([]);

  const getMessages = async () => {
    const messages = await storage.getMessages();
    //simulates server
    const newMessages = messages
      .map(message => {
        return {
          ...message,
          distance: calculateDistance(currentLocation, message.location)
        };
      })
      .sort(sortByDistances)
      .map(message => (
        {
          ...message,
          close: message.distance > 0.1 ? false : true,
          coordinate: message.location,
        }
      ));
    setMessages(newMessages);
  };

  const addMessage = async (message) => {
    await storage.addMessage({ ...message, id: messages.length });
  };

  useEffect(() => {
    getMessages();
  }, []);

  return [messages, getMessages, addMessage];
};

export default useMessages;


/*
const filteredMessages = //filterByDistances(messages, 15)
    messages.sort(sortByDistances)
    .map(message => (
      {
        ...message,
        close: message.distance > 0.1 ? false : true,
        coordinate: message.location,
      }
    ));
*/
