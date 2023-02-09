const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      "mongodb+srv://kai_phy:your1234@cluster0.ddort7l.mongodb.net/mernapp?retryWrites=true&w=majority"
    );

    console.log(`MongoDB connected : ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDB;
