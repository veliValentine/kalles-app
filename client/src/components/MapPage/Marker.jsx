import React from 'react';
import { useHistory } from 'react-router';

import { isReadable } from '../../utils';
import { YELLOW_MESSAGE_THRESHOLD } from '../../utils';

import { Marker as NativeMarker } from 'react-native-maps';

const Marker = ({ message }) => {
  const history = useHistory();
  const { coordinate, id, username, distance } = message;
  const isClose = isReadable(distance);
  const redirectToMessageView = () => {
    if (isClose) {
      history.push(`/message/${id}`);
    }
  };
  return (
    <NativeMarker
      coordinate={coordinate}
      pinColor={isClose ? 'green' : distance < YELLOW_MESSAGE_THRESHOLD ? 'yellow' : 'red'}
      key={id}
      title={isClose ? 'Click to read' : `Distance to message ${distance}km`}
      description={`By ${username}`}
      onCalloutPress={redirectToMessageView}
    />
  );
};

export default Marker;
