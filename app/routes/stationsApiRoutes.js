import StationsController from "../controllers/stationsController";

export default (router, app) => {
  const modelBase = "stations";
  const modelIdentifier = "id";
  const stationsController = new StationsController(app, modelBase);

  router.get(
    `/${modelBase}`,
    stationsController.getStations.bind(stationsController)
  );

  router.post(
    `/${modelBase}/add`,
    stationsController.addStation.bind(stationsController)
  );

  router.post(
    `/${modelBase}/add-bulk`,
    stationsController.addBulkStations.bind(stationsController)
  );
};
