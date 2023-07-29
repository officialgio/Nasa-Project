const { parse } = require("csv-parse");
const fs = require("fs");

const habitablePlanets = [];

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

fs.createReadStream("kepler_data.csv") // reads raw data in bytes
  .pipe(
    parse({
      comment: "#",
      columns: true, // return each row as a js object (k, v)
    })
  )
  .on("data", (data) => {
    if (isHabitablePlanet(data)) {
      habitablePlanets.push(data);
    }
  })
  .on("error", (err) => {
    console.error(err);
  })
  .on("end", () => {
    console.log(
      habitablePlanets.map((planet) => {
        return planet["kepler_name"];
      })
    );
    console.log(`${habitablePlanets.length} habitable planets found!`);
  });

module.exports = {
    planets: habitablePlanets,
};
