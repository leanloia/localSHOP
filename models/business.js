const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const businessSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    adress: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    webpage: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['Hairdress', `Clothing`, `Coffee shop`, `Restaurant`, `Shoe store`, `Bookstore`, `Toy store`, `Fruits and Vegetables`],
        required: true
    },
    about: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    review: [{
        user: String,
        comment: String,
    }, {
        default: ''
    }]
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
});

businessSchema.set("timestamps", true);

const Business = mongoose.model("Business", businessSchema);

module.exports = Business;