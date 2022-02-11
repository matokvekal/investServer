import PassengersPlanner from "../controllersPlanner/passengersPlanner";

export default (router, app) => {
  const modelBase = "passengers";
  const passengersPlanner = new PassengersPlanner(app, modelBase);

  router.get(
    `/${modelBase}`,
    passengersPlanner.getAllRecords.bind(passengersPlanner)
  );

  router.post(
    `/${modelBase}/add`,
    passengersPlanner.addRecord.bind(passengersPlanner)
  );

  router.get(
    `/${modelBase}/remove`,
    passengersPlanner.removeRecord.bind(passengersPlanner)
  );

  router.get(
    `/${modelBase}/move`,
    passengersPlanner.movePassengersPlanner.bind(passengersPlanner)
  );

  // adding passenger;url: /api/v1/planner/passengers/add-passenger
  router.post(
    `/${modelBase}/add-passenger`,
    passengersPlanner.addPassengerForOrder.bind(passengersPlanner)
  );

  // move passenger/s to another station;url: /api/v1/planner/passengers/move-passenger
  router.put(
    `/${modelBase}/move-passenger`,
    passengersPlanner.movePassengerToAnotherStation.bind(passengersPlanner)
  );

  // edit passenger details;url: /api/v1/planner/passengers/edit-passenger
  router.put(
    `/${modelBase}/edit-passenger`,
    passengersPlanner.updatePassengerDetails.bind(passengersPlanner)
  );

  // remove passenger/s from order;url: /api/v1/planner/passengers/remove-passenger
  router.post(
    `/${modelBase}/remove-passenger`,
    passengersPlanner.removePassengerFromOrder.bind(passengersPlanner)
  );

  // get all passengers for selected station; url: /api/v1/planner/passengers/get-all-passengers-for-station
  router.get(
    `/${modelBase}/get-all-passengers-for-station`,
    passengersPlanner.getAllPassengersForStation.bind(passengersPlanner)
  );
};
