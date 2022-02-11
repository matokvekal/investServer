import BaseControllerPlanner from "./baseControllerPlanner";
const { QueryTypes } = require("sequelize");
const alertUtils = require("../utils/alertUtils");

class CarDriverBankControllerPlanner extends BaseControllerPlanner {
    constructor(app, modelName, sequelize) {
        super(app, modelName, sequelize);
    }

    getAllRecords = async (req, res) => {
        const passedDate = req.query.date;
        let _company_id = req.company_id;

        const _zones = req.user.zones;
        const _zoneArr = _zones.split(",");

        let sqlZone = "";
        _zoneArr.map(
            (z, i) =>
            (sqlZone +=
                `order_scopes LIKE "%${z}%"` + (_zoneArr.length > i + 1 ? " OR " : ""))
        );
        if (sqlZone) {
            sqlZone = ' (' + sqlZone + ') ';
        }

        let sqlDate = "";
        if (passedDate) {
            sqlDate = ` AND trip_start < '${passedDate}' AND trip_end > '${passedDate}' `;
        }

        const response = this.sequelize.query("SELECT * FROM v_planning WHERE " + sqlZone + sqlDate + " AND company_id=" + _company_id, { type: QueryTypes.SELECT });

        response
            .then(d =>
                res.status(200).send(d)
            )
            .catch((err) => {
                // res.status(500).send({
                //     message:
                //         err.message ||
                //         "Some error occurred while getting car-driver-bank-records.",
                // });
                res.createErrorLogAndSend({ err: err.message || "Some error occurred while getting car-driver-bank-records." });
            });
    };


    // GET /car-driver-bank/get-orders
    getCarDriverBankViewWithOrders = async (req, res) => {
        let resp = {};
        try {
            resp = await this.sequelize.query('SELECT *, v.car_scopes as zones FROM `v_car_driver_bank` as v', { type: QueryTypes.SELECT });
            let resourceBankIds = [];

            for (let k = 0; k < resp.length; k++) {
                resourceBankIds.push(resp[k].resource_bank_id)
            }

            if (resourceBankIds && resourceBankIds.length > 0) {

                let planning = await this.sequelize.query(`SELECT id, order_id, resource_bank_id FROM planning WHERE resource_bank_id IN (${resourceBankIds})`, { type: QueryTypes.SELECT });

                let orders = {};
                for (let i = 0; i < planning.length; i++) {
                    let order = await this.sequelize.query(`SELECT * FROM orders WHERE id = ${planning[i].order_id}`, { type: QueryTypes.SELECT });
                    if (!orders[planning[i].resource_bank_id] || orders[planning[i].resource_bank_id].length == 0) {
                        orders[planning[i].resource_bank_id] = []
                    }
                    orders[planning[i].resource_bank_id].push(order[0]);
                }

                for (let i = 0; i < resp.length; i++) {
                    if (!resp[i].order) {
                        resp[i].order = [];
                    }
                    if (orders[resp[i].resource_bank_id]) {
                        (resp[i].order).push(orders[resp[i].resource_bank_id])
                    }
                }
                return res.json(resp)
            }
            return res.json([])

        } catch (e) {
            // return res.status(500).send({
            //     message: e.message || "Some error occurred while getting driver widget.",
            // });
            return res.createErrorLogAndSend({ message: e.message || "Some error occurred while getting driver widget." });
        }
    }

    updatePlanningResourceBankId = async (req, res) => {
        let resp = {};
        try {
            const { new_resource_bank_id, planning_id } = req.body;
            if (new_resource_bank_id && planning_id) {
                resp = await this.sequelize.query(`UPDATE planning SET resource_bank_id = ${new_resource_bank_id} WHERE id = ${planning_id}`);
                await alertUtils.updateAlertsFunction(this.sequelize);
                return res.send(resp);
            }
            // return res.status(500).send({
            //     message: "Resource bank id or Planning id not passed.",
            // });
            return res.createErrorLogAndSend({ err: "Resource bank id or Planning id not passed." });
        } catch (e) {
            // return res.status(500).send({
            //     message: e.message || "Some error occurred while getting driver widget.",
            // });
            return res.createErrorLogAndSend({ err: e.message || "Some error occurred while getting driver widget." });
        }
    }


    // GET driver-widget/get-orders-by-resource-bank-ids
    // getOrdersForResourceBankIds = async (req, res) => {
    //     let resourceBankIds = parseInt(req.query.resourcebankids);
    //     if (resourceBankIds) {

    //         let planning = await this.sequelize.query(`SELECT id, order_id FROM planning WHERE resource_bank_id IN (${resourceBankIds})`, { type: QueryTypes.SELECT });

    //         let orders = {};
    //         for (let i = 0; i < planning.length; i++) {
    //             let order = await this.sequelize.query(`SELECT * FROM orders WHERE id = ${planning[i].order_id}`, { type: QueryTypes.SELECT });

    //             if (!orders[planning[i].order_id] || orders[planning[i].order_id].length == 0) {
    //                 orders[planning[i].order_id] = []
    //             }
    //             orders[planning[i].order_id].push(order[0]);

    //         }

    //         res.json(orders);

    //     }

    //     return res.status(500).send({
    //         message: "Some error occurred while getting driver widget by resource bank id.",
    //     });

    // }


}

export default CarDriverBankControllerPlanner;






