const { Schema, model } = require("mongoose");

// This is a subdocument schema, it won't become its own model but we'll use it as the schema for the User's `savedBooks` array in User.js
const medSchema = new Schema(
  {
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    medName: {
      type: String,
      unique: true,
      required: true,
    },
    maxDailyDoses: {
      type: Number,
    },
    minTimeBetween: {
      type: Number,
    },
    remindersBool: {
      type: Boolean,
      required: true,
    },
    doses: [
      {
        doseScheduled: {
          type: Date,
        },
        doseLogged: {
          type: Date,
        }
      },
    ]
    // TODO add icon
  }
);

const Med = model("Med", medSchema);

module.exports = Med;
