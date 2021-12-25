const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sessSchema = new Schema({
  expires: {
    type: Date,
    default: null,
  },
  session: {
    type: Object,
    default: {},
  },
});

module.exports = mongoose.model('Session', sessSchema);
