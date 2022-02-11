import TypesControllerMobile from "../controllersMobile/typesControllerMobile";

export default (router, app) => {
  const modelBase = "types";
  const typesControllerMobile = new TypesControllerMobile(app, modelBase);

  router.get(
    `/${modelBase}`,
    typesControllerMobile.getColors.bind(typesControllerMobile)
  );
};
