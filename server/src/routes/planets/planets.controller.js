const { getAllPlanets } = require("../../models/planet.model");

function httGetAllPlanets(req, res) {
  return res.status(200).json(getAllPlanets());
}

module.exports = { httGetAllPlanets };
