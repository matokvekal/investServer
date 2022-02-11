import AllStationsController from "../controllers/allStationsController";

export default (router, app) => {
  const modelBase = "all-stations";

  const allStationsController = new AllStationsController(app, modelBase);

  router.get(
    `/${modelBase}`,
    allStationsController.getAllStations.bind(allStationsController)
  );
};
