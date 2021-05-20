import { useState, useEffect, useContext } from 'react';
import StorageContext from '../contexts/StorageContext';
import { fetchMessages } from '../service/messageService';

const useMessages = (currentLocation) => {
  const storage = useContext(StorageContext);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    getMessages();
  }, [currentLocation]);

  const getMessages = async () => {
    const messages = await fetchMessages(currentLocation);
    setMessages(messages);
  };

  // TODO POST message to server
  const addMessage = async (message) => {
    const newMessage = { ...message, id: messages.length.toString() };
    await storage.addMessage(newMessage);
    getMessages();
  };

  return [messages, getMessages, addMessage];
};

export default useMessages;
