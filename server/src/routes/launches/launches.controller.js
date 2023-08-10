const { getAllLaunches } = require("../../models/launches.model");

function HttpGetAllLaunches(req, res) {
  return res.status(200).json(getAllLaunches());
}

module.exports = {
  HttpGetAllLaunches,
};
