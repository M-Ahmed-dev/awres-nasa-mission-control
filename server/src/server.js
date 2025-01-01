//another way of creating express server
const http = require("http");
const app = require("./app");
const PORT = process.env.PORT || 8000;
const mongoose = require("mongoose");

const MONGO_URL =
  "mongodb+srv://nasa-api:6XVyrVSCNYVeF5qX@nasa-cluster.wkv4u.mongodb.net/nasa?retryWrites=true&w=majority&appName=nasa-cluster";

const { loadPlanets } = require("./models/planet.model");

const server = http.createServer(app);

mongoose.connection.once("open", () => {
  console.log("MongoDb Connection Ready");
});

mongoose.connection.on("error", (err) => {
  console.error(`MongoDb:`, err);
});

async function startServer() {
  await mongoose.connect(MONGO_URL);
  await loadPlanets();
  server.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
  });
}

startServer();
