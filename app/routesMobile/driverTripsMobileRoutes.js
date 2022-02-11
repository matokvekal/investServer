import DriverTripsControllerMobile from "../controllersMobile/driverTripsControllerMobile";

export default (router, app) => {
  const modelBase = "driver-trips";

  const driverTripsControllerMobile = new DriverTripsControllerMobile(
    app,
    modelBase
  );

  router.get(
    `/${modelBase}`,
    driverTripsControllerMobile.getDriverTrips.bind(
      driverTripsControllerMobile
    )
  );

  router.get(
    `/${modelBase}/count-common-order-number`,
    driverTripsControllerMobile.getCountCommonOrderNumber.bind(
      driverTripsControllerMobile
    )
  );

  router.get(
    `/${modelBase}/events`,
    driverTripsControllerMobile.getTripEvents.bind(
      driverTripsControllerMobile
    )
  );

  router.put(
    `/${modelBase}/approve`,
    driverTripsControllerMobile.approvePlanning.bind(
      driverTripsControllerMobile
    )
  );

  router.put(
    `/${modelBase}/status`,
    driverTripsControllerMobile.statusPlanning.bind(
      driverTripsControllerMobile
    )
  );

  router.post(
    `/${modelBase}/add`,
    driverTripsControllerMobile.addData.bind(
      driverTripsControllerMobile
    )
  );

  router.post(
    `/${modelBase}/add-image`,
    driverTripsControllerMobile.addImage.bind(
      driverTripsControllerMobile
    )
  );

};