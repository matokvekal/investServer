import BaseControllerPlanner from "./baseControllerPlanner";
const { QueryTypes } = require("sequelize");
const alertUtils = require("../utils/alertUtils");

class AlertControllerPlanner extends BaseControllerPlanner {
    constructor(app, modelName, sequelize) {
        super(app, modelName, sequelize);
    }

    getAllRecords = async (req, res) => {
        let _company_id = req.company_id;
        const response = this.sequelize.query(`SELECT * FROM driver_alerts`, { type: QueryTypes.SELECT });

        response
            .then(d =>
                res.status(200).send(d)
            )
            .catch((err) => {
                // res.status(500).send({
                //     message:
                //         err.message ||
                //         "Some error occurred while getting orders.",
                // });
                return res.createErrorLogAndSend({ message: err.message || "Some error occurred while getting orders." });
            });
    }

    updateAlerts = async (req, res) => {
        // let _company_id = req.company_id;

        try {
            await alertUtils.updateAlertsFunction(this.sequelize, req, res);
        } catch (e) {
            return await res.createErrorLogAndSend({ message: e.message || "Some error occurred while getting driver widget." });
        }
    }

}

export default AlertControllerPlanner;
