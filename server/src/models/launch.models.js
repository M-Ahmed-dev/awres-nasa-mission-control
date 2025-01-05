const launchesDatabase = require("./launches.mongo");
const planetsDatabase = require("./planets.mongo");
const axios = require("axios");

const DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
  flightNumber: 100, //flight_number
  mission: "Kepler Exploration X", //name
  rocket: "Explorere IS1", //rocket.name
  target: "Kepler-442 b", // not applicable for now
  launchDate: new Date("December 27, 2030"), // date_local
  customer: ["ZTM", "NASA"], // payload.customers for each payload
  upcoming: true, // upcoming
  success: true, // success
};

saveLaunch(launch);

const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";

async function populateDatabase() {
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });

  if (response.status !== 200) {
    console.log(`Problem downloading launch data`);
    throw new Error("Launch data download failed!");
  }

  const launchDocs = response.data.docs;
  for (const launchDoc of launchDocs) {
    const payloads = launchDoc["payloads"];
    const customers = payloads.flatMap((payload) => {
      return payload["customers"];
    });

    const launch = {
      flightNumber: launchDoc["flight_number"],
      mission: launchDoc["name"],
      rocket: launchDoc["rocket"]["name"],
      launchDate: launchDoc["date_local"],
      upcoming: launchDoc["upcoming"],
      success: launchDoc["success"],
      customer: customers,
    };

    console.log(`${launch.flightNumber} ${launch.mission} ${launch.customer}`);
    await saveLaunch(launch);
  }
}

async function loadLaunchesData() {
  const firstLaunchExists = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });

  if (firstLaunchExists) {
    console.log("Launch data already loaded");
  } else {
    await populateDatabase();
  }
}

async function findLaunch(filter) {
  return await launchesDatabase.findOne(filter);
}

async function getAllLaunches(skip, limit) {
  return await launchesDatabase
    .find({}, { _id: 0, __v: 0 })
    .skip(skip)
    .limit(limit);
}

// save Launch In Db
async function saveLaunch(launch) {
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
  const planet = await launchesDatabase.updateOne(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    { upsert: true }
  );

  if (!planet) throw new Error("No matching planet found");
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
  return await findLaunch({
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
  loadLaunchesData,
  getAllLaunches,
  scheduleNewLaunch,
  existsLaunchWithId,
  abortLaunchById,
};
