const launches = new Map();

let latestFlightNumber = 100;

const launch = {
  flightNumber: 100,
  mission: "Kepler Exploration",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27, 2030"),
  target: "Kepler-442 b",
  customer: ["ZTM", "NASA"],
  upcoming: true,
  success: true,
};

launches.set(launch.flightNumber, launch);

/**
 * @param {number} launchId specific launch identifier
 * @returns If the launch exists.
 */
const existsLaunchWithId = (launchId) => launches.has(launchId);

/**
 * @returns Newly Array of the map values from the launches map.
 */
function getAllLaunches() {
  return Array.from(launches.values());
}

/**
 * Assign newly launch with the default properties.
 * @param {Object} launch
 */
function addNewLaunch(launch) {
  latestFlightNumber++;
  launches.set(
    latestFlightNumber,
    Object.assign(launch, {
      success: true,
      upcoming: true,
      customers: ["Giovanny", "NASA"],
      flightNumber: latestFlightNumber,
    })
  );
}

/**
 *
 * @param {number} launchId
 * @returns aborted launch with newly properties set accordingly.
 */
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
