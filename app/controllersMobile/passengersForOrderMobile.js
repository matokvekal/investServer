import res from "express/lib/response";
import BaseControllerMobile from "./baseControllerMobile";
const { QueryTypes } = require("sequelize");
class StationsForOrderMobile extends BaseControllerMobile {
    constructor(app, modelName, sequelize) {
        super(app, modelName, sequelize);
    }

    driversModel = "drivers";

    getModels(model) {
        this._dbModel = this.app.get("dbModels")[model];

        return this._dbModel;
    }

    getPassengersForOrder = async (req, res) => {
        let driverId = req.user.driver_id || req.query.driver_id;
        let orderId = req.query.order_id;

        if (!driverId || !orderId || orderId ==='undefined') {
            // return res.status(500).send({
            //     message: "Some error occurred while getting passengers for order - driver_id and order_id: required.",
            // });
            return await res.createErrorLogAndSend({ err: "Some error occurred while getting passengers for order - driver_id and order_id: required." });
        }

        let planningsByOrderId = await this.sequelize.query(`SELECT * FROM planning WHERE order_id = ${orderId} `, { type: QueryTypes.SELECT });
        let rbIds = [];
        for (let i = 0; i < planningsByOrderId.length; i++) {
            rbIds.push(planningsByOrderId[i].resource_bank_id);
        }

        if (rbIds.length == 0) {
            // return res.status(500).send({
            //     message: "Do not have permission to view the passengers for order.",
            // });
            return await res.createErrorLogAndSend({ err: "Do not have permission to view the passengers for order." });
        }

        let existingDriverForResourceBank = await this.sequelize.query(`SELECT * FROM resource_bank WHERE id IN (${rbIds.join()}) AND driver_id = ${driverId}; `, { type: QueryTypes.SELECT });

        if (existingDriverForResourceBank && Object.values(existingDriverForResourceBank).length > 0) {
            let stationsForOrder = await this.sequelize.query(`SELECT * FROM passengers_for_order WHERE order_id = ${orderId} `, { type: QueryTypes.SELECT })
            return res.json(stationsForOrder);
        } else {
            // return res.status(500).send({
            //     message: "Do not have permission to view the passengers for order.",
            // });
            return await res.createErrorLogAndSend({ err: "Do not have permission to view the passengers for order." });
        }

    }

}

export default StationsForOrderMobile;
