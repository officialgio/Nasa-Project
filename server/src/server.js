const http = require("http");

const app = require("./app");

const { mongoConnect } = require("./services/mongo");
const { loadPlanetsData } = require("./models/planets.model");

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer() {
  // Connect to MongoDB
  // Load data & start port
  try {
    await mongoConnect;
    await loadPlanetsData();
  } catch (e) {
    console.error(e);
  }

  server.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
  });
}

startServer();
