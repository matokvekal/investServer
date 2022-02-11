import UserControllerPlanner from "../controllersPlanner/userControllerPlanner";

export default (router, app) => {
  const modelBase = "user";
  const userControllerPlanner = new UserControllerPlanner(app, modelBase);
 
  router.get(
    `/${modelBase}`,
    userControllerPlanner.getUser.bind(userControllerPlanner)
  );

};


