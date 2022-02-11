import CarDriverBankControllerPlanner from "../controllersPlanner/carDriverBankControllerPlanner";

export default (router, app) => {
  const modelBase = "car-driver-bank";
  const carDriverBankControllerPlanner = new CarDriverBankControllerPlanner(
    app,
    modelBase
  );

  router.get(
    `/${modelBase}`,
    carDriverBankControllerPlanner.getAllRecords.bind(
      carDriverBankControllerPlanner
    )
  );

  router.get(
    `/${modelBase}/get-orders`,
    carDriverBankControllerPlanner.getCarDriverBankViewWithOrders.bind(carDriverBankControllerPlanner)
  );

  router.post(
    `/${modelBase}/update-planning-set-cbid`,
    carDriverBankControllerPlanner.updatePlanningResourceBankId.bind(carDriverBankControllerPlanner)
  );

  // router.get(
  //   `/${modelBase}/get-orders-by-resource-bank-ids`,
  //   carDriverBankControllerPlanner.getOrdersForResourceBankIds.bind(carDriverBankControllerPlanner)
  // );


};
