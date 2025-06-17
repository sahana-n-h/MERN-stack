//Defines the user schema for authentication

const mongoose = require('mongoose');



const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
});

module.exports = mongoose.model('User', UserSchema);