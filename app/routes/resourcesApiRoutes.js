import ResourcesController from "../controllers/resourcesController";

export default (router, app) => {
  const modelBase = "resources";
  const modelIdentifier = "id";
  const resourcesController = new ResourcesController(app, modelBase);

  router.get(
    `/${modelBase}`,
    resourcesController.getResources.bind(resourcesController)
  );

  router.get(
    `/${modelBase}/locations`,
    resourcesController.getResourceLocations.bind(resourcesController)
  );

  router.post(
    `/${modelBase}/add`,
    resourcesController.addResource.bind(resourcesController)
  );

  router.post(
    `/${modelBase}/add-bulk`,
    resourcesController.addBulkResources.bind(resourcesController)
  );

  router.put(
    `/${modelBase}/update-stations`,
    resourcesController.updatePrevAndNextStationId.bind(resourcesController)
  );
};
