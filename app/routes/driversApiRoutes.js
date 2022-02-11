import DriversController from "../controllers/driversController";

export default (router, app) => {
  const modelBase = "drivers";
  const modelIdentifier = "id";
  const driversController = new DriversController(app, modelBase);

  router.get(
    `/${modelBase}`,
    driversController.getDrivers.bind(driversController)
  );

  router.post(
    `/${modelBase}/add`,
    driversController.addDriver.bind(driversController)
  );

  router.post(
    `/${modelBase}/add-bulk`,
    driversController.addBulkDrivers.bind(driversController)
  );
};
