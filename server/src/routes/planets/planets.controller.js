const { getAllPlanets } = require("../../models/planets.model");
const { get } = require("./planets.router");

async function httpGetAllPlanets(req, res) {
  return res.status(200).json(await getAllPlanets());
}

module.exports = {
  httpGetAllPlanets,
};
