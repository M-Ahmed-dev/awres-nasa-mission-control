const {
  getAllLaunches,
  addNewLaunch,
  existsLaunchWithId,
  abortLaunchById,
} = require("../../models/launch.models");

function httpGetAllLaunches(req, res) {
  return res.status(200).json(getAllLaunches());
}
// Array.from(launches.values());

function httpAddNewLaunch(req, res) {
  const launch = req.body;

  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.target ||
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

function httpAbortLaunch(req, res) {
  const launchId = Number(req.params.id);
  console.log("launchId::", launchId);

  if (!existsLaunchWithId(launchId))
    return res.status(404).json({
      error: "Launch dosen't exist",
    });

  const aborted = abortLaunchById(launchId);
  return res.status(200).json(aborted);
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
};
