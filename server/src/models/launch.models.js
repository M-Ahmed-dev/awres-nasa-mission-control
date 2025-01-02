// const launches = require("./launches.mongo");

const launches = new Map();
let latestFlightNumber = 100;

const launch = {
  flightNumber: 100,
  mission: "Kepler Exploration X",
  rocket: "Explorere IS1",
  target: "Kepler-442 b",
  launchDate: new Date("December 27, 2030"),
  customer: ["ZTM", "NASA"],
  upcoming: true,
  success: true,
};

launches.set(launch.flightNumber, launch);

function getAllLaunches() {
  return Array.from(launches.values());
}

function addNewLaunch(launch) {
  latestFlightNumber++;
  // launches.set(
  //   launch.flightNumber,
  //   Object.assign(launch, {
  //     success: true,
  //     upcoming: true,
  //     customers: ["Zero to Mastery", "NASA"],
  //     flightNumber: latestFlightNumber,
  //   })
  // );
  const newLaunch = Object.assign({}, launch, {
    success: true,
    upcoming: true,
    customers: ["Zero to Mastery", "NASA"],
    flightNumber: latestFlightNumber,
  });
  launches.set(newLaunch.flightNumber, newLaunch);
}

function existsLaunchWithId(launchId) {
  return launches.has(launchId);
}

function abortLaunchById(launchId) {
  const aborted = launches.get(launchId);
  aborted.upcoming = false;
  aborted.success = false;
  return aborted;
}

module.exports = {
  getAllLaunches,
  addNewLaunch,
  existsLaunchWithId,
  abortLaunchById,
};
