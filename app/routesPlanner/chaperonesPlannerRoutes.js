import ChaperonesPlanner from "../controllersPlanner/chaperonesControllerPlanner";

export default (router, app) => {
  const modelBase = "chaperones";
  const chaperonesPlanner = new ChaperonesPlanner(app, modelBase);

  router.get(
    `/${modelBase}`,
    chaperonesPlanner.getChaperones.bind(chaperonesPlanner)
  );
};
