const express = require("express");
// const planetsController = require("./planets.controller");
const { httGetAllPlanets } = require("./planets.controller");

const planetsRouter = express.Router();

planetsRouter.get("/", httGetAllPlanets);

module.exports = planetsRouter;
