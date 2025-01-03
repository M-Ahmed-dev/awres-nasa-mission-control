const {
  getAllLaunches,
  scheduleNewLaunch,
  existsLaunchWithId,
  abortLaunchById,
} = require("../../models/launch.models");

async function httpGetAllLaunches(req, res) {
  const launches = await getAllLaunches();
  return res.status(200).json(launches);
}
// Array.from(launches.values());

async function httpAddNewLaunch(req, res) {
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

  await scheduleNewLaunch(launch);
  return res.status(201).json(launch);
}

async function httpAbortLaunch(req, res) {
  const launchId = Number(req.params.id);
  console.log("launchId::", launchId);

  const existLaunch = await existsLaunchWithId(launchId);

  if (!existLaunch)
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
