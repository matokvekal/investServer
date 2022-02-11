import VehicleController from "../controllers/OLD-vehicleController";

export default (router, app) => {

    const modelBase = 'vehicles';
    const modelIdentifier = 'id';
    const vehicleController = new VehicleController(app, modelBase);

    router.get(`/${modelBase}`, vehicleController.getAll.bind(vehicleController));

    router.get(`/${modelBase}/:${modelIdentifier}`, vehicleController.getOne.bind(vehicleController));

    router.post(`/${modelBase}`, vehicleController.create.bind(vehicleController));

    router.put(`/${modelBase}/:${modelIdentifier}`, vehicleController.update.bind(vehicleController));

    router.delete(`/${modelBase}/:${modelIdentifier}`, vehicleController.deleteOne.bind(vehicleController));

}