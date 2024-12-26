const express = require("express");
// const planetsController = require("./planets.controller");
const { getAllPlanets } = require("./planets.controller");

const planetsRouter = express.Router();

planetsRouter.get("/", getAllPlanets);

module.exports = planetsRouter;
