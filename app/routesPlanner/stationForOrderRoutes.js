import StationForOrderPlanner from "../controllersPlanner/stationForOrderPlanner";

export default (router, app) => {
  const modelBase = "stations-for-order";
  const stationForOrderPlanner = new StationForOrderPlanner(app, modelBase);

  router.get(
    `/${modelBase}`,
    stationForOrderPlanner.getAllRecords.bind(stationForOrderPlanner)
  );

  router.post(
    `/${modelBase}/add`,
    stationForOrderPlanner.addRecord.bind(stationForOrderPlanner)
  );

  router.get(
    `/${modelBase}/remove`,
    stationForOrderPlanner.removeRecord.bind(stationForOrderPlanner)
  );

  //adding station to trip;url: /api/v1/planner/stations-for-order/add-station
  router.post(
    `/${modelBase}/add-station`,
    stationForOrderPlanner.createStationForOrder.bind(stationForOrderPlanner)
  );

  //editing station to trip;url: /api/v1/planner/stations-for-order/edit-station
  router.put(
    `/${modelBase}/edit-station`,
    stationForOrderPlanner.changeStationDetails.bind(stationForOrderPlanner)
  );

  //transfer station to another order;url: /api/v1/planner/stations-for-order/transfer-station
  router.put(
    `/${modelBase}/transfer-station`,
    stationForOrderPlanner.moveStationToAnotherOrder.bind(
      stationForOrderPlanner
    )
  );

  //delete station from order;url: /api/v1/planner/stations-for-order/remove-station
  router.post(
    `/${modelBase}/remove-station`,
    stationForOrderPlanner.removeStationFromOrder.bind(stationForOrderPlanner)
  );
};
