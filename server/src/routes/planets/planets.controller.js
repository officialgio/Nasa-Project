const { getAllPlanets } = require("../../models/planets.model");
const { get } = require("./planets.router");

function httpGetAllPlanets(req, res) {
  return res.status(200).json(getAllPlanets());
}

module.exports = {
  httpGetAllPlanets,
};
