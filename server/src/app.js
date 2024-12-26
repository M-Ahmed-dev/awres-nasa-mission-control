const express = require("express");
const cors = require("cors");
const app = express();
const planetsRouter = require("./routes/planets/planets.router");

//this will allow all request from other origins
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(express.json());
app.use("/planets", planetsRouter);

module.exports = app;
