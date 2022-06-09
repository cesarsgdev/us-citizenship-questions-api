const mongoose = require("mongoose");
const { Schema } = mongoose;

const questionSchema = new Schema(
  {
    question: {
      type: String,
      required: true,
      minlength: 10,
      trim: true,
    },

    answers: {
      type: [{ type: String, trim: true }],
    },

    answer: {
      type: String,
      required: true,
      minlength: 3,
      trim: true,
    },
  },
  { timestamps: true }
);

const questionModel = mongoose.model("questions", questionSchema);

module.exports = questionModel;
