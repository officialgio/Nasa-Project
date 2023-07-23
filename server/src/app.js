const express = require('express');

const planetsRouter = require('./routes/planets/planets.router'); // import

const app = express();
app.use(express.json);

app.use(planetsRouter); // use

module.exports = app;
