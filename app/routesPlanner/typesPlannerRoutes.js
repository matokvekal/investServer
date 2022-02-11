import TypesControllerPlanner from "../controllersPlanner/typesControllerPlanner";

export default (router, app) => {
  const modelBase = "types";
  const typesControllerPlanner = new TypesControllerPlanner(app, modelBase);

  router.get(
    `/${modelBase}`,
    typesControllerPlanner.getColors.bind(typesControllerPlanner)
  );
};
