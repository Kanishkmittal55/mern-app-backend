const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

// Finally Made a CRUD featured REST Api backend for spawnser.com, a parent of Appopener.com Using Express js, node js
// and JSON web Token (JWT)

// @desc Register new User
// @route - POST /api/goals
// @access - Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, occupation, email, password } = req.body;
  if (!name || !email || !password || !occupation) {
    res.status(400);
    throw new Error("Please add  all fields");
  }

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    name,
    occupation,
    email,
    password: hashedPassword
  });

  if (user) {
    res.status(200).json({
      _id: user.id,
      occupation: user.occupation,
      name: user.name,
      email: user.email,
      token: generateToken(user._id) // So the user that we register we the user back and then we get the _id of the user to generate a token
    });
  } else {
    res.status(400);
    throw new Error("Invalid User data");
  }
});

// @desc  Authenticate a user
// @route - POST /api/user/login
// @access - Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for User email
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      occupation: user.occupation,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    });
  } else {
    res.status(400);
    throw new Error("Invalid credentials");
  }
});

// How to protect a route ? We do it with middleware , middleware is a function that run between the request response cycle.
// @desc Get new data
// @route - GET /api/goals
// @access - Private
const getMe = asyncHandler(async (req, res) => {
  const { _id, name, occupation, email } = await User.findById(req.user.id);

  res.status(200).json({
    id: _id,
    occupation,
    name,
    email
  });
});

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d"
  });
};

module.exports = {
  registerUser,
  loginUser,
  getMe
};
