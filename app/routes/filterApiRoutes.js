import FilterController from "../controllers/filterController";

export default (router, app) => {
  const modelBase = "filter";
  const modelIdentifier = "id";
  const filterController = new FilterController(app, modelBase);

  router.get(
    `/${modelBase}`,
    filterController.getFilteredData.bind(filterController)
  );

  router.get(
    `/${modelBase}/chosen`,
    filterController.getSelectedItems.bind(filterController)
  );
};
