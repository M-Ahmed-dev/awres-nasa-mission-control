const morgan = require("morgan");
const path = require("path");
const express = require("express");
const cors = require("cors");
const app = express();
const api = require("./routes/api");

//this will allow all request from other origins
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(morgan("combined"));

app.use("/v1", api);

app.use(express.static(path.join(__dirname, "..", "public")));

//serving file

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

module.exports = app;
