import { useCallback, useEffect, useState } from "react";

import { httpGetPlanets } from "./requests";

function usePlanets() {
  // saved state
  const [planets, savePlanets] = useState([]);

  const getPlanets = useCallback(async () => {
    const fetchedPlanets = await httpGetPlanets();
    savePlanets(fetchedPlanets);
  }, []);

  // call function right away when the program runs
  useEffect(() => {
    getPlanets();
  }, [getPlanets]);

  return planets;
}

export default usePlanets;