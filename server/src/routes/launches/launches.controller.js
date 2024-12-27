const { getAllLaunches, addNewLaunch } = require("../../models/launch.models");

function httpGetAllLaunches(req, res) {
  return res.status(200).json(getAllLaunches());
}
// Array.from(launches.values());

function httpAddNewLaunch(req, res) {
  let launch = req.body;
  launch.launchDate = new Date(launch.launchDate);
  addNewLaunch(launch);

  return res.status(201).json(launch);
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
};
