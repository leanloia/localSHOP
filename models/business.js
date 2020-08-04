const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const businessSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  adress: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  image_url: {
    type: String,
  },
  phone: {
    type: Number,
    required: true,
  },
  webpage: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: [
      "Hairdress",
      `Clothing`,
      `Coffee shop`,
      `Restaurant`,
      `Shoe store`,
      `Bookstore`,
      `Toy store`,
      `Fruits and Vegetables`,
    ],
    required: true,
  },
  about: {
    type: String,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [{
    type: Schema.Types.ObjectId,
    ref: 'Review'
  }],

  favouriteBy: [{
    type: Schema.Types.ObjectId,
    ref: "User",
  }]


}, {
  timestamps: {
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  },
});

businessSchema.set("timestamps", true);

const Business = mongoose.model("Business", businessSchema, "businesses");

module.exports = Business;
