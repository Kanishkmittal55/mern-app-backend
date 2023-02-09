const mongoose = require("mongoose");

const noteSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User" // each ticket is connect to a user
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "ticket" // each ticket is connect to a user
    },
    text: {
      type: String,
      required: [true, "Please add some text"]
    },
    isStaff: {
      type: Boolean,
      default: false
    },
    staffId: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Note", noteSchema);
