import PublishControllerPlanner from '../controllersPlanner/publishControllerPlanner';

export default (router, app ) => {
    const modelBase = "publish";
    const publishControllerPlanner = new PublishControllerPlanner(app,
        modelBase);

    router.put(
        `/${modelBase}/reset`,
        publishControllerPlanner.resetPublishPlanning.bind(publishControllerPlanner)
    );

    
    router.put(
        `/${modelBase}/publish`,
        publishControllerPlanner.publishPlanning.bind(publishControllerPlanner)
    );



};
