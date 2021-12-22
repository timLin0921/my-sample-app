const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
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
  lastLoginDate: {
    type: Date,
    require: false,
  },
  sessionId: {
    type: String,
    require: false,
  },
});

module.exports = mongoose.model('User', userSchema);
