const express = require("express");

const { httpGetAllPlanets } = require("./planets.controller");

const planetRouter = express.Router();

// TODO: make this only '/' instead
planetRouter.get("/", httpGetAllPlanets);

module.exports = planetRouter;
