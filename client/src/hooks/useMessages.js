import { useState, useEffect } from 'react';
import { fetchMessages, postMessage } from '../service/messageService';

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
    if (currentLocation) {
      const newMessage = {
        ...message,
        location: currentLocation
      };
      const addedMessage = await postMessage(newMessage);
      setMessages(messages.concat(addedMessage));
    }
  };

  return [messages, getMessages, addMessage];
};

export default useMessages;
