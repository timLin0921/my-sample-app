const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  unque: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    default: '',
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createDate: {
    type: Date,
    require: true,
  },
  provider: {
    type: String,
    require: true,
  },
  lastLoginDate: {
    type: Date,
    require: false,
  },
  loginTimes: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model('User', userSchema);
