import DriverControllerMobile from "../controllersMobile/driverControllerMobile";

export default (router, app) => {
  const modelBase = "driver";

  const driverControllerMobile = new DriverControllerMobile(
    app,
    modelBase
  );

  router.get(
    `/${modelBase}`,
    driverControllerMobile.getDriverDetails.bind(
      driverControllerMobile
    )
  );
  router.post(
    `/${modelBase}/sendReport`,
    driverControllerMobile.driverSendReport.bind(
      driverControllerMobile
    )
  );
  router.post(
    `/${modelBase}/updateDriverLocation`,
    driverControllerMobile.updateDriverLocation.bind(
      driverControllerMobile
    )
  );
  router.post(
    `/${modelBase}/add`,
    driverControllerMobile.addDriverData.bind(
      driverControllerMobile
    )
  );
  router.post(
    `/${modelBase}/update`,
    driverControllerMobile.updateDriverData.bind(
      driverControllerMobile
    )
  );
  router.get(
    `/${modelBase}/getReportsType`,
    driverControllerMobile.getReportsType.bind(
      driverControllerMobile
    )
  );





};