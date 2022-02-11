import TransitController from "../controllers/transitController";

export default (router, app) => {
  const modelBase = "transit";
  const modelIdentifier = "id";
  const transitController = new TransitController(app, modelBase);

  router.get(
    `/${modelBase}`,
    transitController.getTransit.bind(transitController)
  );

  router.post(
    `/${modelBase}/add`,
    transitController.addStation.bind(transitController)
  );

  router.post(
    `/${modelBase}/add-bulk`,
    transitController.addBulkTransit.bind(transitController)
  );
};
