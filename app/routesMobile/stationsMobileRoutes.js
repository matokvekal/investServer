import StationsControllerMobile from "../controllersMobile/stationsControllerMobile";

export default (router, app) => {
    const modelBase = "stations";

    const stationsControllerMobile = new StationsControllerMobile(
        app,
        modelBase
    );

    // router.put(
    //     `/${modelBase}/updateStationLocation`,
    //     stationsControllerMobile.updateStationLocation.bind(
    //         stationsControllerMobile
    //     )
    // );
    router.post(
        `/${modelBase}/updateArriveToStation`,
        stationsControllerMobile.updateArriveToStation.bind(
            stationsControllerMobile
        )
    );

};