import UserControllerMobile from "../controllersMobile/userControllerMobile";

export default (router, app) => {
  const modelBase = "user";
  const userControllerMobile = new UserControllerMobile(app, modelBase);
 
  router.get(
    `/${modelBase}`,
    userControllerMobile.getUser.bind(userControllerMobile)
  );

};


