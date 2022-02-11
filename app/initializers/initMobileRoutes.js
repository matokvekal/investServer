import mobileRoutes from "../routesMobile/mobileRoutes";

export default (router, app) => {
  // Generates router initiation for each imported routing
  Object.keys(mobileRoutes).forEach((k) => {
    mobileRoutes[k](router, app);
  });
};
