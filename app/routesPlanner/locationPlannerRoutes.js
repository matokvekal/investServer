import LocationPlanner from "../controllersPlanner/locationControllerPlanner";

export default (router, app) => {
  const modelBase = "car-locations";
  const locationPlanner = new LocationPlanner(app, modelBase);

  router.get(
    `/${modelBase}`,
    locationPlanner.getCarLocations.bind(locationPlanner)
  );
};
