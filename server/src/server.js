//another way of creating express server
const http = require("http");
const app = require("./app");
const PORT = process.env.PORT || 8000;
const { loadPlanets } = require("./models/planet.model");
const { loadLaunchesData } = require("./models/launch.models");
const { mongoConnect } = require("../services/mongo");
const server = http.createServer(app);

async function startServer() {
  await mongoConnect();
  await loadPlanets();
  await loadLaunchesData();

  server.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
  });
}

startServer();
