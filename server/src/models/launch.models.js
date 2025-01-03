const launchesDatabase = require("./launches.mongo");
const planetsDatabase = require("./planets.mongo");

const launches = new Map();
const DEFAULT_FLIGHT_NUMBER = 100;

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

saveLaunch(launch);

//return all launches
async function getAllLaunches() {
  return await launchesDatabase.find({}, { _id: 0, __v: 0 });
}

// save Launch In Db
async function saveLaunch(launch) {
  const matchingPlanets = await planetsDatabase.findOne({
    keplerName: launch.target,
  });

  if (!matchingPlanets) throw new Error("No Matching planets found!!");

  await launchesDatabase.updateOne(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    { upsert: true }
  );
}

async function getLatestFlightNumber() {
  const latestLaunch = await launchesDatabase.findOne().sort("-flightNumber");

  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }

  return latestLaunch.flightNumber;
}

async function scheduleNewLaunch(launch) {
  const newFlightNumber = (await getLatestFlightNumber()) + 1;
  const newLaunch = Object.assign({}, launch, {
    success: true,
    upcoming: true,
    customer: ["ZTM", "NASA"],
    flightNumber: newFlightNumber,
  });

  await saveLaunch(newLaunch);
}

async function existsLaunchWithId(launchId) {
  return await launchesDatabase.findOne({
    flightNumber: launchId,
  });
}

async function abortLaunchById(launchId) {
  const aborted = await launchesDatabase.updateOne(
    {
      flightNumber: launchId,
    },
    {
      $set: {
        upcoming: false,
        success: false,
      },
    }
  );

  return (
    aborted.matchedCount === 1 &&
    (aborted.modifiedCount === 1 || aborted.nModified === 0)
  );
}

module.exports = {
  getAllLaunches,
  scheduleNewLaunch,
  existsLaunchWithId,
  abortLaunchById,
};
