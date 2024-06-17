const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  photo: String,
  gender: String,
  age: Date,
  friends:Array,
});


const User = mongoose.model('User', userSchema);

module.exports = User;
