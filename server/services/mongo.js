const mongoose = require("mongoose");
require("dotenv").config();

const URL = process.env.MONGO_URL;

mongoose.connection.once("open", () => {
  console.log("MongoDb Connection Ready");
});

mongoose.connection.on("error", (err) => {
  console.error(`MongoDb:`, err);
});

async function mongoConnect() {
  await mongoose.connect(URL);
}

async function mongoDisConnect() {
  await mongoose.disconnect();
}

module.exports = {
  mongoConnect,
  mongoDisConnect,
};
