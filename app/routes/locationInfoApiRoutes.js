import LocationInfoController from "../controllers/locationInfoController";

export default (router, app) => {
  const modelBase = "location-info";
  const modelIdentifier = "id";
  const locationInfoController = new LocationInfoController(app, modelBase);

  router.get(
    `/${modelBase}`,
    locationInfoController.getLocationInfo.bind(locationInfoController)
  );
};
