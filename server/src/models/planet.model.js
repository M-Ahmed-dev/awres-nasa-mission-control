const { parse } = require("csv-parse");
const fs = require("fs");
const path = require("path");
const planets = require("./planets.mongo");

function isHabitAblePlanet(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}

function loadPlanets() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(__dirname, "..", "..", "data", "kepler_data.csv")
    )
      .pipe(
        parse({
          comment: "#",
          columns: true,
        })
      )
      .on("data", async (data) => {
        if (isHabitAblePlanet(data)) {
          addAllPlanets(data);
        }
      })
      .on("error", (err) => {
        console.log(err);
        reject(err);
      })
      .on("end", async () => {
        const totalPlanetsFound = (await getAllPlanets())?.length;
        console.log(`${totalPlanetsFound} habitable planets found`);
        resolve();
      });
  });
}

async function getAllPlanets() {
  // return habitablePlanets;
  return await planets.find(
    {},
    //to exclude properties
    {
      _id: 0,
      __v: 0,
    }
  );
}

async function addAllPlanets(data) {
  try {
    await planets.updateOne(
      {
        keplerName: data.kepler_name,
      },
      {
        keplerName: data.kepler_name,
      },
      {
        upsert: true,
      }
    );
  } catch (error) {
    console.log(error);
  }
}

module.exports = { getAllPlanets, loadPlanets };
