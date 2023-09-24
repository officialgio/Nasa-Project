const launchesDatabase = require("./launches.mongo");
const planets = require("./planets.mongo");

const DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
  flightNumber: 100,
  mission: "Kepler Exploration",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27, 2030"),
  target: "Kepler-442 b",
  customers: ["ZTM", "NASA"],
  upcoming: true,
  success: true,
};

saveLaunch(launch);

async function saveLaunch(launch) {
  try {
    // Check that the launch has a valid target before saving to the db
    const planet = await planets.findOne({
      keplerName: launch.target,
    });

    if (!planet) {
      throw new Error("No matching planet found.");
    }

    // upsert the launch if it is valid
    await launchesDatabase.findOneAndUpdate(
      {
        flightNumber: launch.flightNumber,
      },
      launch,
      {
        upsert: true,
      }
    );
  } catch (err) {
    console.error("Could not save launch:", err);
  }
}

async function getLatestFlightNumber() {
  const { flightNumber } = await launchesDatabase
    .findOne()
    .sort({ flightNumber: -1 }); // Sort in descending order
  if (!flightNumber) return DEFAULT_FLIGHT_NUMBER;
  return flightNumber;
}

/**
 * @returns Newly Array of the map values from the launches map.
 */
async function getAllLaunches() {
  return await launchesDatabase.find({});
}

/**
 * @param {number} launchId specific launch identifier
 * @returns If the launch exists.
 */
const existsLaunchWithId = async (launchId) =>
  await launchesDatabase.findOne({ flightNumber: launchId });

/**
 * Assign newly launch with the default properties.
 * @param {Object} launch
 */
async function scheduleNewLaunch(launch) {
  const newFlightNumber = (await getLatestFlightNumber()) + 1;
  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ["Giovanny", "NASA"],
    flightNumber: newFlightNumber,
  });

  await saveLaunch(newLaunch);
}

/**
 *
 * @param {number} launchId
 * @returns aborted launch with newly properties set accordingly.
 */
async function abortLaunchById(launchId) {
  const aborted = await launchesDatabase.updateOne(
    {
      flightNumber: launchId,
    },
    {
      upcoming: false,
      success: false,
    }
  );
  console.log(aborted);

  return aborted.modifiedCount === 1;
}

module.exports = {
  getAllLaunches,
  scheduleNewLaunch,
  existsLaunchWithId,
  abortLaunchById,
};
