const morgan = require("morgan");
const path = require("path");
const express = require("express");
const cors = require("cors");
const app = express();

// routers
const planetsRouter = require("./routes/planets/planets.router");
const launchesRouter = require("./routes/launches/launches.router");

//this will allow all request from other origins
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(morgan("combined"));

app.use("/planets", planetsRouter);
app.use("/launches", launchesRouter);
app.use(express.static(path.join(__dirname, "..", "public")));

//serving file

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

module.exports = app;
