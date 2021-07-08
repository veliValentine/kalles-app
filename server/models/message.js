const mongoose = require('mongoose');
const { timeStamp } = require('../utils/time');

const DELETE_TIME_HOURS = 24;

const messageSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  location: {
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
  },
  createDay: {
    type: Date,
    default: timeStamp(),
    expires: timeStamp(DELETE_TIME_HOURS),
  },
  likes: { type: Number, default: 0 },
});

/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
messageSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Message', messageSchema);
