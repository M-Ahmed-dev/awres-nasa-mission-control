const mongoose = require("mongoose");

const MONGO_URL =
  "mongodb+srv://nasa-api:6XVyrVSCNYVeF5qX@nasa-cluster.wkv4u.mongodb.net/nasa?retryWrites=true&w=majority&appName=nasa-cluster";

mongoose.connection.once("open", () => {
  console.log("MongoDb Connection Ready");
});

mongoose.connection.on("error", (err) => {
  console.error(`MongoDb:`, err);
});

async function mongoConnect() {
  await mongoose.connect(MONGO_URL);
}

async function mongoDisConnect() {
  await mongoose.disconnect();
}

module.exports = {
  mongoConnect,
  mongoDisConnect,
};
