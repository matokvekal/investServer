import UserController from "../controllers/userController";

export default (router, app) => {
  const modelBase = "user";
  const userController = new UserController(app, modelBase);
 
  router.get(
    `/${modelBase}`,
    userController.getUser.bind(userController)
  );

};


