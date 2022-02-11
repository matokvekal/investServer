import PointOfInterestController from "../controllers/pointOfInterestController";

export default (router, app) => {
  const modelBase = "points-of-interest";

  const pointOfInterestController = new PointOfInterestController(
    app,
    modelBase
  );

  router.get(
    `/${modelBase}`,
    pointOfInterestController.getPointsOfInterest.bind(
      pointOfInterestController
    )
  );
};
