import PassengersForOrderMobile from "../controllersMobile/passengersForOrderMobile";

export default (router, app) => {
    const modelBase = "passengers-for-order";

    const passengersForOrderMobile = new PassengersForOrderMobile(
        app,
        modelBase
    );

    router.get(
        `/${modelBase}`,
        passengersForOrderMobile.getPassengersForOrder.bind(
            passengersForOrderMobile
        )
    );

};