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



  getStationsForOrderById = async (req, res) => {
    try {
      let orderId = req.query.order_id;
      if (!orderId) {
        return await res.createErrorLogAndSend({ err: "Some error occurred while getting station for order - order_id: required." });
      }
      let response = await this.sequelize.query(
        `SELECT * FROM stations_for_order WHERE order_id =${orderId} ORDER BY id ASC LIMIT 1 `
        , { type: QueryTypes.SELECT }
      );
      return res.send(response);
    } catch (e) {
      return await res.createErrorLogAndSend({ err: e.message || "Some error occurred while getting station for order." });
    }
  }

  getStationsForOrder = async (req, res) => {
    try {
      let driverPhone = req.user.user_name;
      let orderId = req.query.order_id;
      if (!orderId && !driverPhone) {
        // return res.status(500).send({
        //   message:
        //     "Some error occurred while moving passengers for order - driverPhone and order_id: required.",
        // });
        return await res.createErrorLogAndSend({ err: "Some error occurred while moving passengers for order - driverPhone and order_id: required." });
      }
      let response = await this.sequelize.query(
        `SELECT * FROM station_for_order_for_driver WHERE driver_phone_number = "${driverPhone}" and  order_id =${orderId} `
        , { type: QueryTypes.SELECT }
      );
      return res.send(response);
    } catch (e) {
      // return res.status(500).send({
      //   message:
      //     e.message || "Some error occurred while getting station for order.",
      // });
      return await res.createErrorLogAndSend({ err: e.message || "Some error occurred while getting station for order." });
    }
  };

  updateStationsForOrder = async (req, res) => {
    const data = req.body.data;
    let driverId = req.user.driver_id || req.query.driver_id;
    let orderId = req.query.order_id;
    const stationForOrderId = parseInt(req.query.id);

    let _company_id = req.company_id;


    if (!driverId || !orderId || orderId === 'undefined') {
      // return res.status(500).send({
      //   message: "Some error occurred while getting passengers for order - driver_id and order_id: required.",
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
      //   message: "Do not have permission to view the passengers for order.",
      // });
      return await res.createErrorLogAndSend({ err: "Do not have permission to view the passengers for order." });
    }

    let existingDriverForResourceBank = await this.sequelize.query(`SELECT * FROM resource_bank WHERE id IN (${rbIds.join()}) AND driver_id = ${driverId}; `, { type: QueryTypes.SELECT });

    if (existingDriverForResourceBank && Object.values(existingDriverForResourceBank).length > 0) {

      if (!data || Object.values(data).length == 0) {
        // return res.status(500).send({
        //   message: "Some error occurred while updating station for order - data: required.",
        // });
        return await res.createErrorLogAndSend({ err: "Some error occurred while updating station for order - data: required." });
      }

      let updateSql = [];
      for (let i = 0; i < Object.values(data).length; i++) {
        updateSql.push(" `" + Object.keys(data)[i] + "` = '" + Object.values(data)[i] + "' ");
      }

      let updateSqlQuery = `UPDATE stations_for_order SET ${updateSql.join()} WHERE id = ${stationForOrderId}`;

      const response = this.sequelize.query(updateSqlQuery);

      response
        .then(d =>
          res.status(200).send(d)
        )
        .catch((err) => {
          // res.status(500).send({
          //   message:
          //     "Some error occurred while getting orders.",
          // });
          res.createErrorLogAndSend({ err: err.message || "Some error occurred while getting orders." });
        });

    } else {
      // return res.status(500).send({
      //   message: "Do not have permission to view the passengers for order.",
      // });
      return await res.createErrorLogAndSend({ err: "Do not have permission to view the passengers for order." });
    }
  };

}

export default StationsForOrderMobile;
