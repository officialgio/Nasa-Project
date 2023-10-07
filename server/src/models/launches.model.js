const axios = require("axios");

const launchesDatabase = require("./launches.mongo");
const planets = require("./planets.mongo");

const DEFAULT_FLIGHT_NUMBER = 100;

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
async function getAllLaunches(skip, limit) {
  return await launchesDatabase
    .find({}, { _id: 0, __v: 0 })
    .sort({ flightNumber: 1 })
    .skip(skip)
    .limit(limit);
}

/**
 * Assign newly launch with the default properties.
 * @param {Object} launch
 */
async function scheduleNewLaunch(launch) {
  // Check that the launch has a valid target before saving to the db
  const planet = await planets.findOne({
    keplerName: launch.target,
  });

  if (!planet) {
    throw new Error("No matching planet found.");
  }
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
 * Load launch data from the DB.
 * If it exist, then don't populate the data to avoid an expensive API call.
 * Otherwise, download all data from the SpaceX API response and add to the DB.
 * @see https://github.com/r-spacex/SpaceX-API/blob/master/docs/queries.md
 */
async function loadLaunchData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });

  if (firstLaunch) {
    console.log("Launch data was already loaded");
  } else {
    await populateLaunches();
  }
}

const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";

/**
 * Make API call to SpaceX API with filter parameters
 * And construct the launches object
 */
async function populateLaunches() {
  console.log("Downloading launch data...");
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
    console.log("Problem downloading launch data");
    throw new Error("Launch data download failed.");
  }

  const launchDocs = response.data.docs;

  // Create the launch object from the API response
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
      customers,
    };

    console.log(`${launch.flightNumber}, ${launch.mission}`);

    // populate launches collection
    await saveLaunch(launch);
  }
}

async function saveLaunch(launch) {
  try {
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

const findLaunch = async (filter) => await launchesDatabase.findOne(filter);

/**
 * @param {number} launchId specific launch identifier
 * @returns {boolean} If the launch exists.
 */
const existsLaunchWithId = async (launchId) =>
  await findLaunch({ flightNumber: launchId });

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
  return aborted.modifiedCount === 1;
}

module.exports = {
  loadLaunchData,
  getAllLaunches,
  scheduleNewLaunch,
  existsLaunchWithId,
  abortLaunchById,
};
