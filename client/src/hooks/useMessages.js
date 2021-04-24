import { useState, useEffect, useContext } from 'react';
import StorageContext from '../contexts/StorageContext';
import { SERVER_URL_BASE } from '../utils/URL';
import { calculateDistance } from '../utils';

const useMessages = (currentLocation) => {
  const storage = useContext(StorageContext);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    getMessages();
  }, []);

  const getMessages = async () => {
    try {
      // TODO add location info to request
      const response = await fetch(`${SERVER_URL_BASE}/messages`);
      const serverMessages = await response.json();
      setMessages(parseServerMessages(serverMessages));
    } catch (e) {
      if (e instanceof Error) {
        console.log(e.message);
      } else {
        throw e;
      }
    }
  };

  const parseServerMessages = (messages = []) => (
    messages.map((message) => ({
      ...message,
      coordinate: message.location,
      distance: calculateDistance(message.location, currentLocation)
    }))
  );

  // TODO POST message to server
  const addMessage = async (message) => {
    const newMessage = { ...message, id: messages.length.toString() };
    await storage.addMessage(newMessage);
    getMessages();
  };

  return [messages, getMessages, addMessage];
};

export default useMessages;
