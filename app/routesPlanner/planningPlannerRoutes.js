import PlanningControllerPlanner from "../controllersPlanner/planningControllerPlanner";

export default (router, app) => {
    const modelBase = "planning";
    const planningControllerPlanner = new PlanningControllerPlanner(
        app,
        modelBase
    );

    router.put(
        `/${modelBase}/update_alerts`,
        planningControllerPlanner.updatePlanningAlert.bind(
            planningControllerPlanner
        )
    );

    router.post(
        `/${modelBase}/update_order_driver_vehicle_time`,
        planningControllerPlanner.updatePlanningOrderDriverVehicleAndTime.bind(
            planningControllerPlanner
        )
    );

    router.get(
        `/${modelBase}/get_drivers_planning_with_stations`,
        planningControllerPlanner.getDriversPlanningWIthStations.bind(
            planningControllerPlanner
        )
    );

    router.post(
        `/${modelBase}/update_order_time_and_stations_time`,
        planningControllerPlanner.updateOrderTimeAndStationsTime.bind(
            planningControllerPlanner
        )
    );

    router.get(
        `/${modelBase}/remove_planning_by_id`,
        planningControllerPlanner.removePlanningById.bind(
            planningControllerPlanner
        )
    );


    router.post(
        `/${modelBase}/add_planning`,
        planningControllerPlanner.addPlanning.bind(
            planningControllerPlanner
        )
    );

    router.post(
        `/${modelBase}/update_planning_modal`,
        planningControllerPlanner.updatePlanningModal.bind(
            planningControllerPlanner
        )
    );

    router.post(
        `/${modelBase}/remove_order_from_planning`,
        planningControllerPlanner.removeOrderFromPlanning.bind(
            planningControllerPlanner
        )
    );


};

