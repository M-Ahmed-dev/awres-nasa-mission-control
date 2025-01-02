const { getAllPlanets } = require("../../models/planet.model");

async function httGetAllPlanets(req, res) {
  const allPlanets = await getAllPlanets();
  return res.status(200).json(allPlanets);
}

module.exports = { httGetAllPlanets };
