import StationsForOrderMobile from "../controllersMobile/stationsForOrderMobile";

export default (router, app) => {
    const modelBase = "stations-for-order";

    const stationsForOrderMobile = new StationsForOrderMobile(
        app,
        modelBase
    );

    router.get(
        `/${modelBase}`,
        stationsForOrderMobile.getStationsForOrder.bind(
            stationsForOrderMobile
        )
    );

    router.get(
        `/${modelBase}/by-order-id`,
        stationsForOrderMobile.getStationsForOrderById.bind(
            stationsForOrderMobile
        )
    );

};