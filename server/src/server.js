const http = require("http");
const mongoose = require("mongoose");
const app = require("./app");

const { loadPlanetsData } = require("./models/planets.model");

const PORT = process.env.PORT || 8000;

const MONGO_URL = `mongodb+srv://nasa-api:bOwwbDOkhDcQJjEJ@nasacluster.zmf9elo.mongodb.net/?retryWrites=true&w=majority`;

const server = http.createServer(app);

// Handle opening and error after initial connection
mongoose.connection.on("open", () => {
  console.log("MongoDB connection ready!");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

async function startServer() {
  // Connect to MongoDB
  try {
    await mongoose.connect(MONGO_URL);
  } catch (e) {
    console.error(e);
  }

  // Load data & start port
  await loadPlanetsData();
  server.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
  });
}

startServer();
