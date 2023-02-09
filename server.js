const express = require("express");
const colors = require("colors");
var cors = require("cors");

const dotenv = require("dotenv").config();
const { errorHandler } = require("./middleware/errorMiddleware");
const connectDB = require("./config/db");

const port = process.env.PORT || 3000;
connectDB();
const app = express();

app.use(express.json()); // In express we have body parser for raw json
app.use(express.urlencoded({ extended: false }));

app.use(cors());

// Mounting the Routers

app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/tickets", require("./routes/ticketRoutes"));

app.use(errorHandler);
// By using this erroHandler you have overided the default express errorHandler

app.listen(port, () =>
  console.log(`Server started on port ${port}`.yellow.underline)
);

// We can make the port the environment variable.
