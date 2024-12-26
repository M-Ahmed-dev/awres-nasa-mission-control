//another way of creating express server
const http = require("http");
const app = require("./app");
const PORT = process.env.PORT || 8000;
const { loadPlanets } = require("./models/planet.model");

const server = http.createServer(app);

async function startServer() {
  await loadPlanets();
  server.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
  });
}

startServer();
