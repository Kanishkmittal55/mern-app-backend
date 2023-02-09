const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const {
  getTickets,
  createTickets,
  getTicket,
  updateTicket,
  deleteTicket
} = require("../controllers/ticketController");

// Reroute into note Router
const noteRouter = require("./notesRoute");
router.use("/:ticketId/notes", noteRouter);

router.route("/").get(protect, getTickets).post(protect, createTickets);

router
  .route("/:id")
  .get(protect, getTicket)
  .put(protect, updateTicket)
  .delete(protect, deleteTicket);

module.exports = router;
