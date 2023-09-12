const { Schema, model } = require("mongoose");

// This is a subdocument schema, it won't become its own model but we'll use it as the schema for the User's `savedBooks` array in User.js
const noteSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    medicine: {
      type: String,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    period: {
      type: String,
      required: true,
    },
    numberOfTime: {
      type: String,
      required: true,
    },
    total: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

const Note = model("Note", noteSchema);

module.exports = Note;
