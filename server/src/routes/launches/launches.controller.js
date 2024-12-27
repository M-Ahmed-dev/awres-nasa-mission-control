const { getAllLaunches, addNewLaunch } = require("../../models/launch.models");

function httpGetAllLaunches(req, res) {
  return res.status(200).json(getAllLaunches());
}
// Array.from(launches.values());

function httpAddNewLaunch(req, res) {
  let launch = req.body;

  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.destination ||
    !launch.launchDate
  ) {
    return res.status(400).json({
      error:
        "Mission Name, Rocket Name, planet destination and launch date are all required!!",
    });
  }

  launch.launchDate = new Date(launch.launchDate);
  if (isNaN(launch.launchDate.valueOf())) {
    return res.status(400).json({
      error: "Invalid Date",
    });
  }
  addNewLaunch(launch);

  return res.status(201).json(launch);
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
};
