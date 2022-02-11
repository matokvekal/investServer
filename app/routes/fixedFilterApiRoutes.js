import FixedFilterController from "../controllers/fixedFilterController";

export default (router, app) => {
  const modelBase = "fixed-filter";

  const fixedFilterController = new FixedFilterController(app, modelBase);

  router.get(
    `/${modelBase}`,
    fixedFilterController.getFixedFilters.bind(fixedFilterController)
  );
};
