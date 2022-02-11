import plannerRoutes from "../routesPlanner/plannerRoutes";

export default (router, app) => {
  // Generates router initiation for each imported routing
  Object.keys(plannerRoutes).forEach((k) => {
    plannerRoutes[k](router, app);
  });
};
