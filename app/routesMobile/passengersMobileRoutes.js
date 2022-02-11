import PassengersControllerMobile from "../controllersMobile/passengersControllerMobile";

export default (router, app) => {
    const modelBase = "passengers";

    const passengersControllerMobile = new PassengersControllerMobile(
        app,
        modelBase
    );

    router.get(
        `/${modelBase}/passengersForOrders`,
        passengersControllerMobile.getPassengersForOrder.bind(
            passengersControllerMobile
        )
    );

    router.put(
        `/${modelBase}/updateBoarding`,
        passengersControllerMobile.updateBoarding.bind(
            passengersControllerMobile
        )
    );
};

