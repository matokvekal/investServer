import HrIssuesControllerHr from "../controllersHr/hrIssuesControllerHr";

export default (router, app) => {
    const modelBase = "hr-issues";

    const hrIssuesControllerHr = new HrIssuesControllerHr(
        app,
        modelBase
    );

    router.get(
        `/${modelBase}`,
        hrIssuesControllerHr.getHrIssues.bind(
            hrIssuesControllerHr
        )
    );

    router.post(
        `/${modelBase}/update`,
        hrIssuesControllerHr.updateHrIssues.bind(
            hrIssuesControllerHr
        )
    );

    router.get(
        `/${modelBase}/delete`,
        hrIssuesControllerHr.deleteHrIssues.bind(
            hrIssuesControllerHr
        )
    );

    router.post(
        `/${modelBase}/add`,
        hrIssuesControllerHr.addHrIssues.bind(
            hrIssuesControllerHr
        )
    );


};




