import apiRoutes from "../routes/apiRoutes";

export default (router, app) => {
  // Generates router initiation for each imported routing
  Object.keys(apiRoutes).forEach((k) => {
    apiRoutes[k](router, app);
  });
};
