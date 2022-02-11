import HrIssuesControllerMobile from "../controllersMobile/hrIssuesControllerMobile";

export default (router, app) => {
    const modelBase = "hr-issues";

    const hrIssuesControllerMobile = new HrIssuesControllerMobile(
        app,
        modelBase
    );

    router.get(
        `/${modelBase}`,
        hrIssuesControllerMobile.getHrIssues.bind(
            hrIssuesControllerMobile
        )
    );

    router.post(
        `/${modelBase}/update`,
        hrIssuesControllerMobile.updateHrIssues.bind(
            hrIssuesControllerMobile
        )
    );

    router.get(
        `/${modelBase}/delete`,
        hrIssuesControllerMobile.deleteHrIssues.bind(
            hrIssuesControllerMobile
        )
    );

    router.post(
        `/${modelBase}/add`,
        hrIssuesControllerMobile.addHrIssues.bind(
            hrIssuesControllerMobile
        )
    );


};




