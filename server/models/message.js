const mongoose = require('mongoose');
const { timeStamp } = require('../utils/time');

const EXPIRES_TIME_MINUTES = 7 * 24 * 60 * 60;

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
      min: -90,
      max: 90,
    },
    longitude: {
      type: Number,
      required: true,
      min: -180,
      max: 180,
    },
  },
  createDay: {
    type: Date,
    default: timeStamp(),
  },
  likes: { type: Number, default: 0 },
});

messageSchema.index({ createDay: 1 }, { expireAfterSeconds: EXPIRES_TIME_MINUTES });

/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
messageSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    returnedObject.createDay = returnedObject.createDay.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Message', messageSchema);
