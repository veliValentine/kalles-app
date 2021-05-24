import React from 'react';
import { useHistory } from 'react-router';

import { Marker as NativeMarker } from 'react-native-maps';
import { Alert } from 'react-native';

import { isReadable, YELLOW_MESSAGE_THRESHOLD, READABLE_TRESHOLD } from '../../utils';

const Marker = ({ message }) => {
  const history = useHistory();
  const { distance, id, username, location } = message;
  const isClose = isReadable(distance);
  const pinColor = isClose ? 'green' : distance < YELLOW_MESSAGE_THRESHOLD ? 'yellow' : 'red';
  const title = isClose ? 'Click to read' : `Distance to message ${distance}km`;

  const redirectToMessageView = () => {
    if (isClose) {
      history.push(`/message/${id}`);
    } else {
      messageNotReadable();
    }
  };
  const messageNotReadable = () => {
    const alertTitle = 'You are too far away from the message';
    const alertMessage = [
      `Message is ${distance}km from your location.`,
      `You need to be within ${READABLE_TRESHOLD}km to read the message.`
    ];
    Alert.alert(alertTitle, alertMessage.join('\n\n'));
  };
  return (
    <ViewMarker
      key={id}
      location={location}
      pinColor={pinColor}
      title={title}
      description={`By ${username}`}
      onCalloutPress={redirectToMessageView}
    />
  );
};

export const ViewMarker = ({ location, pinColor, title, description, onCalloutPress }) => (
  <NativeMarker
    coordinate={location}
    pinColor={pinColor}
    title={title}
    description={description}
    onCalloutPress={onCalloutPress}
  />
);

export default Marker;
