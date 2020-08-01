const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  profilePic: {
    type: String,
    default: './images/profile-picture.png',
  },
  name: String,
  email: String,
  password: String,
  isOwner: {
    type: Boolean,
    default: false
  },

  businessOwned: [{
    type: Schema.Types.ObjectId,
    ref: 'Business'
  }]

});

userSchema.set("timestamps", true);

const User = mongoose.model("User", userSchema, 'users');

module.exports = User;