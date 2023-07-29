const express = require('express');

const { getAllPlanets } = require('./planets.controller');

const planetRouter = express.Router();

// TODO: make this only '/' instead
planetRouter.get('/planets', getAllPlanets);

module.exports = planetRouter;