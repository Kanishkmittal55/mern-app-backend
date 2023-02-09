const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Ticket = require("../models/ticketModel");
const Note = require("../models/noteModel");

// @desc Get notes for a ticket
// @route - GET /api/tickets/:ticketId/notes
// @access - Private
const getNotes = asyncHandler(async (req, res) => {
  // Get User using the id and the JWT
  const user = await User.findById(req.user.id); // We check for the user

  if (!user) {
    // If no User
    res.status(401); // Error
    throw new Error("User not found");
  }

  // other wise find the tickets where user id = to the extracted user id i.e. extracted from the json token created and returned at login by the user ( async operation )
  const ticket = await Ticket.findById(req.params.ticketId);

  if (ticket.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User Not Authorized");
  }

  const notes = await Note.find({ ticket: req.params.ticketId });
  res.status(200).json(notes);
});

module.exports = {
  getNotes
};

// @desc Create Ticket Note
// @route - Post /api/tickets/:ticketId/notes
// @access - Private
const addNote = asyncHandler(async (req, res) => {
  // Get User using the id and the JWT
  const user = await User.findById(req.user.id); // We check for the user

  if (!user) {
    // If no User
    res.status(401); // Error
    throw new Error("User not found");
  }

  // other wise find the tickets where user id = to the extracted user id i.e. extracted from the json token created and returned at login by the user ( async operation )
  const ticket = await Ticket.findById(req.params.ticketId);

  if (ticket.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User Not Authorized");
  }

  const note = await Note.create({
    text: req.body.text,
    isStaff: false,
    ticket: req.params.ticketId,
    user: req.user.id
  });
  res.status(200).json(note);
});

module.exports = {
  getNotes,
  addNote
};
