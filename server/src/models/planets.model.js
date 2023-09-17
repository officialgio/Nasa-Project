const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse");

const planets = require("./planets.mongo");

/**
 * The planet needs to be confirmed
 * and it needs to have starlight that matches our criteria
 * and its radius can't be more than 1.6
 */
function isHabitablePlanet(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}

/**
 * Read the csv file and pipe it.
 * @returns awaitable content for the frontend
 */
function loadPlanetsData() {
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
        if (isHabitablePlanet(data)) {
          // insert + update = upsert (add if object doesn't exist)
          savePlanet(data);
        }
      })
      .on("error", (err) => {
        console.log(err);
      })
      .on("end", async () => {
        const countPlanetsFound = (await getAllPlanets()).length;
        console.log(`${countPlanetsFound} habitable planets found!`);
        resolve();
      });
  });
}

async function getAllPlanets() {
  try {
    return await planets.find({}, "keplerName _id");
  } catch (err) {
    console.error("Error fetching planets:", err);
    throw err;
  }
}

async function savePlanet(planet) {
  try {
    await planets.updateOne(
      {
        keplerName: planet.kepler_name,
      },
      {
        keplerName: planet.kepler_name,
      },
      {
        upsert: true,
      }
    );
  } catch (err) {
    console.error("Could not save planet:", err);
  }
}

module.exports = {
  loadPlanetsData,
  getAllPlanets,
};
