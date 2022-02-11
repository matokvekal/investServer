import BaseController from "./baseController";
import { ServerErrors, ServerMessages } from "../constants/ServerMessages";

class VehicleController extends BaseController {

    getAll(req, res) {
        this.dbModel.findAll().then(results => {
            res.json(results);
        });
    }

    getOne(req, res) {
        const { id } = req.params;

        this.dbModel.findByPk(id)
            .then(data => res.send(data));
    }

    create(req, res) {
        const { plateNumber, description, isActive } = req.body;
        const vehicle = {
            plateNumber,
            description,
            isActive,
        }

        this.dbModel.create(vehicle)
            .then(data => res.json(data))
            .catch(err => {
                // res.status(500).send({ message: err.message || ServerErrors.API_BASE_CREATE_FAIL })
                res.createErrorLogAndSend({ err: err.message || ServerErrors.API_BASE_CREATE_FAIL });
            })
    }

    update(req, res) {
        const { id } = req.params;
        const { plateNumber, description, isActive } = req.body;
        const vehicle = {
            plateNumber,
            description,
            isActive,
        }
        this.dbModel.update(vehicle, { where: { id } })
            .then((status) => {
                if (status == 1) {
                    return res.json({ message: ServerMessages.API_BASE_UPDATE_SUCCESS })
                }

                return res.send({ message: ServerErrors.API_BASE_UPDATE_FAIL });
            })
            .catch(err => {
                // res.status(500).send({ message: err.message || ServerErrors.API_BASE_CREATE_FAIL })
                res.createErrorLogAndSend({ err: err.message || ServerErrors.API_BASE_CREATE_FAIL });
            })
    }

    deleteOne(req, res) {
        const { id } = req.params;

        this.dbModel.destroy({ where: { id } })
            .then(status => {
                if (status == 1) {
                    return res.send({ message: ServerMessages.API_BASE_DELETE_SUCCESS })
                }
                // return res.send({ message: ServerErrors.API_BASE_DELETE_FAIL })
                res.createErrorLogAndSend({ err: ServerErrors.API_BASE_DELETE_FAIL });
            })
            .catch(err => {
                // res.status(500).send({
                //     message: ServerErrors.API_BASE_DELETE_FAIL
                // })
                res.createErrorLogAndSend({ err: err.message || ServerErrors.API_BASE_DELETE_FAIL });
            })
    }

}

export default VehicleController;