import VehiclesController from "../controllers/vehiclesController";

export default (router, app) => {
  const modelBase = "vehicles";
  const modelIdentifier = "id";
  const vehiclesController = new VehiclesController(app, modelBase);

  router.get(
    `/${modelBase}`,
    vehiclesController.getVehicles.bind(vehiclesController)
  );

  router.post(
    `/${modelBase}/add`,
    vehiclesController.addVehicle.bind(vehiclesController)
  );

  router.post(
    `/${modelBase}/add-bulk`,
    vehiclesController.addBulkVehicles.bind(vehiclesController)
  );
};
