import { useState, useEffect } from 'react';
import { fetchMessages } from '../service/messageService';

const useMessages = (currentLocation) => {
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
    setMessages(messages.concat(newMessage));
  };

  return [messages, getMessages, addMessage];
};

export default useMessages;
