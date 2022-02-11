import hrRoutes from "../routesHr/hrRoutes";

export default (router, app) => {
  // Generates router initiation for each imported routing
  Object.keys(hrRoutes).forEach((k) => {
    hrRoutes[k](router, app);
  });
};
