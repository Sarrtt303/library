const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  membership_type: { type: String },
  userId: {type:String},
  // Additional fields as needed
}, { collection: 'users' }); // Specify the collection name if needed

const User = mongoose.model('User', userSchema);
module.exports = User;
