const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviewTitle: {
        type: String,
        require: true
    },
    comment: {
        type: String,
        require: true
    },
    commentTo: {
        type: Schema.Types.ObjectId,
        ref: 'Business'
    }

}, {
    timestamps: {
        createdAt: "createdAt",
        updatedAt: "updatedAt",
    },
})

reviewSchema.set("timestamps", true);

const Review = mongoose.model("Review", reviewSchema, "reviews");

module.exports = Review;