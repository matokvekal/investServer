import TripsController from "../controllers/tripsController";

export default (router, app) => {
  const modelBase = "trips";
  const modelIdentifier = "id";
  const tripsController = new TripsController(app, modelBase);

  router.get(`/${modelBase}`, tripsController.getTrips.bind(tripsController));

  router.post(
    `/${modelBase}/add`,
    tripsController.addStation.bind(tripsController)
  );

  router.post(
    `/${modelBase}/add-bulk`,
    tripsController.addBulkTrips.bind(tripsController)
  );
};
