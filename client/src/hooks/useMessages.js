import { useState, useEffect, useContext } from 'react';
import StorageContext from '../contexts/StorageContext';
import useCurrentLocation from './useCurrentLocation';

import { sortByDistances, calculateDistance } from '../utils';

const useMessages = () => {
  const storage = useContext(StorageContext);
  const [currentLocation] = useCurrentLocation();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    getMessages();
  }, [currentLocation]);

  const getMessages = async () => {
    const messages = await storage.getMessages();
    const newMessages = messages
      .map(message => {
        return {
          ...message,
          distance: currentLocation ? calculateDistance(currentLocation, message.location) : 99,
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
    const newMessage = { ...message, id: messages.length.toString() };
    console.log(newMessage);
    await storage.addMessage(newMessage);
    getMessages();
  };

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
