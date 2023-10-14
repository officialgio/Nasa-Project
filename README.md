# Nasa-Project
This is a Fullstack Project that replicates a NASA launch program. This project includes querying and making request to [SpaceX API](https://github.com/r-spacex/SpaceX-API)

# Architecture
<p align="center">
    <img width="600" src="./assets/architecture.png">
</p>


# Set up

#### If you wish to run the program do the following:

* Have a MongoDB Cluster ready to use named as `nasa-api` and configure the secret key to your .env file at the `server` root.
```env
PORT=8000
MONGO_URL=mongodb+srv://nasa-api:OnwmGJHytvDgTLMC@nasacluster.zmf9elo.mongodb.net/?
```
* Navigate to `server/src/services/mongo.js`.
* Ensure that `process.env.MONGO_URL` contains your MongoDB cluster to make request to the REST API and get launches and planets from your database.

```javascript
const mongoose = require("mongoose");

require("dotenv").config();

const MONGO_URL = process.env.MONGO_URL;

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
```

* Go the `server` root in your terminal and start the server first: 
```env
npm start server
```

* Once you have started the server and the application made the request successfully. Confirm you're able to run a GET request as follows: 
<p align="center">
    <img width="600" src="./assets/get.png">
</p>

* If everything works, terminate the server and navigate to the `root` of the application in your terminal and run the following command to start the client and server:
```env
npm run deploy
```
<p align="center">
    <img width="600" src="./assets/home.png">
</p>

<p align="center">
    <img width="600" src="./assets/history.png">
</p>


