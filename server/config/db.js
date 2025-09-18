const mongoose = require("mongoose");

const connectDB = async () => {
  const dbName = process.env.DB_NAME || "company_management";
  const mongoUri = process.env.MONGO_URI || `mongodb://127.0.0.1:27017/${dbName}`;
  await mongoose.connect(mongoUri);
  console.log("✅ MongoDB connected");
};

module.exports = connectDB;
