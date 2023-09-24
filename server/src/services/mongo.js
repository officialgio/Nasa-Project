const mongoose = require("mongoose");

const MONGO_URL = `mongodb+srv://nasa-api:bOwwbDOkhDcQJjEJ@nasacluster.zmf9elo.mongodb.net/?retryWrites=true&w=majority`;

// Handle opening and error after initial connection
mongoose.connection.on("open", () => {
  console.log("MongoDB connection ready!");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

async function mongoConnect() {
  // Connect to MongoDB
  try {
    await mongoose.connect(MONGO_URL);
  } catch (e) {
    console.error(e);
  }
}

async function mongoDisconnect() {
  await mongoose.disconnect();
}

module.exports = {
  mongoConnect,
  mongoDisconnect,
};
