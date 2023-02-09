const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Ticket = require("../models/ticketModel");

// How to protect a route ? We do it with middleware , middleware is a function that run between the request response cycle.
// @desc Get user tickets
// @route - GET /api/tickets
// @access - Private
const getTickets = asyncHandler(async (req, res) => {
  // Get User using the id and the JWT
  const user = await User.findById(req.user.id); // We check for the user

  if (!user) {
    // If no User
    res.status(401); // Error
    throw new Error("User not found");
  }

  // other wise find the tickets where user id = to the extracted user id i.e. extracted from the json token created and returned at login by the user ( async operation )
  const tickets = await Ticket.find({ user: req.user.id });

  res.status(200).json(tickets);
});

// @desc Get a specific ticket
// @route - GET /api/tickets/:id
// @access - Private
const getTicket = asyncHandler(async (req, res) => {
  // Get User using the id and the JWT
  const user = await User.findById(req.user.id); // We check for the user

  if (!user) {
    // If no User
    res.status(401); // Error
    throw new Error("User not found");
  }

  // other wise find the tickets where user id = to the provided user id in the url , as an id is need to be searched( async operation )
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    res.status(404);
    throw new Error("Ticket not found by that id"); // If no ticket then error
  }

  // We dont want anybody to access somebody else's ticket or data hence we do a simple match to match the user id on the ticket being demanded and the user id in the json webtoken of the loginned user.
  if (ticket.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("Not Authorized"); // Throw error if no match
  }

  res.status(200).json(ticket); // Finally return the ticket.
});

// @desc CREATE new tickets
// @route - POST /api/tickets
// @access - Private
const createTickets = asyncHandler(async (req, res) => {
  const { product, description } = req.body; // So what do we expect to get some text related to a product and some text related to description look at the modal you need those things to create a ticket in your MongoDB, along with options like required or not , enum values, so we expect this in req.body

  if (!product || !description) {
    // If no product or description error
    res.status(400);
    throw new Error("Please add a product and description");
  }

  const user = await User.findById(req.user.id); // same find the user now that want to create a ticket

  if (!user) {
    res.status(404).json(`User ${req.user.id} was not found.`); // If no user error
  }

  const ticket = await Ticket.create({
    // is user , product and description then status will be new and these 4 things are required to create a ticket
    product,
    description,
    user: req.user.id,
    status: "new"
  });

  res
    .status(201) // 201 because something is created
    .json(ticket); // then we return the ticket
});

// @desc Update Ticket
// @route PUT /api/tickets/:id
// @access Private
const updateTicket = asyncHandler(async (req, res, next) => {
  // other wise find the tickets where user id = to the provided user id in the url , as an id is need to be searched( async operation )

  // Get User using the id and the JWT
  const user = await User.findById(req.user.id); // We check for the user

  if (!user) {
    // If no User
    res.status(401); // Error
    throw new Error("User not found");
  }

  let ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    res.status(404);
    throw new Error("Ticket not found by that id"); // If no ticket then error
  }

  // We dont want anybody to access somebody else's ticket or data hence we do a simple match to match the user id on the ticket being demanded and the user id in the json webtoken of the loginned user.
  if (ticket.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("Not Authorized"); // Throw error if no match
  }

  ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: ticket
  });
});

// @desc delete Ticket
// @route DELETE /api/tickets/:id
// @access Private
const deleteTicket = asyncHandler(async (req, res, next) => {
  // other wise find the tickets where user id = to the provided user id in the url , as an id is need to be searched( async operation )
  // Get User using the id and the JWT
  const user = await User.findById(req.user.id); // We check for the user

  if (!user) {
    // If no User
    res.status(401); // Error
    throw new Error("User not found");
  }

  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    res.status(404);
    throw new Error("Ticket not found by that id"); // If no ticket then error
  }

  // We dont want anybody to access somebody else's ticket or data hence we do a simple match to match the user id on the ticket being demanded and the user id in the json webtoken of the loginned user.
  if (ticket.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("Not Authorized"); // Throw error if no match
  }

  await ticket.remove();

  res.status(200).json({
    success: true
  });
});

module.exports = {
  getTickets,
  createTickets,
  getTicket,
  updateTicket,
  deleteTicket
};
