import AlertControllerPlanner from "../controllersPlanner/alertControllerPlanner";

export default (router, app) => {
    const modelBase = "driver-alerts";
    const alertControllerPlanner = new AlertControllerPlanner(
        app,
        modelBase
    );

    router.get(
        `/${modelBase}`,
        alertControllerPlanner.getAllRecords.bind(
            alertControllerPlanner
        )
    );
    
    router.get(
        `/${modelBase}/update-alerts`,
        alertControllerPlanner.updateAlerts.bind(
            alertControllerPlanner
        )
    );

};
