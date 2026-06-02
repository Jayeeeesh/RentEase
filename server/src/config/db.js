const mongoose = require("mongoose");

let retryCount = 0;
const MAX_RETRIES = 5;

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing");
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    retryCount = 0;
  } catch (error) {
    console.error(`MongoDB Error: ${error.message}`);

    if (retryCount < MAX_RETRIES) {
      retryCount++;

      console.log(
        `Retrying connection (${retryCount}/${MAX_RETRIES})...`
      );

      setTimeout(connectDB, 5000);
    } else {
      console.error("Max retry attempts reached.");
      process.exit(1);
    }
  }
};

mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB disconnected");
});

mongoose.connection.on("reconnected", () => {
  console.log("MongoDB reconnected");
});

mongoose.connection.on("error", (err) => {
  console.error(`MongoDB Error: ${err.message}`);
});

process.on("SIGINT", async () => {
  await mongoose.connection.close();

  console.log("MongoDB connection closed");
  process.exit(0);
});

module.exports = connectDB;