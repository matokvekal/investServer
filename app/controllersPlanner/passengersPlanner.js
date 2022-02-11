import BaseControllerPlanner from "./baseControllerPlanner";
const { QueryTypes } = require("sequelize");

class PassengersPlanner extends BaseControllerPlanner {
  constructor(app, modelName, sequelize) {
    super(app, modelName, sequelize);
  }

  getAllRecords = async (req, res) => {
    // planning_id
    const orderId = req.query.order_id;

    if (!orderId) {
      return res.createErrorLogAndSend({
        message:
          "Some error occurred while getting passengers for order - order_id: required.",
      });
    }

    let _company_id = req.company_id;

    const response = this.sequelize.query(
      `SELECT * FROM passengers_for_order WHERE order_id = ${orderId} AND company_id= ${_company_id}`,
      { type: QueryTypes.SELECT }
    );

    response
      .then((d) => res.status(200).send(d))
      .catch((err) => {
        res.createErrorLogAndSend({
          message: err.message || "Some error occurred while getting orders.",
        });
      });
  };

  addRecord = async (req, res) => {
    const data = req.body.data;
    let _company_id = req.company_id;

    const orderId = req.query.order_id;
    const stationForOrderId = req.query.station_for_order_id;

    if (!data || Object.values(data).length == 0) {
      // return res.status(500).send({
      //     message: "Some error occurred while adding passenger for order - data: required.",
      // });
      return res.createErrorLogAndSend({
        message: "Some error occurred while adding passenger for order - data: required.",
      });
    }

    let columnsSql = [];
    for (let i = 0; i < Object.values(data).length; i++) {
      columnsSql.push(Object.keys(data)[i]);
    }

    let dataSql = [];
    for (let i = 0; i < Object.values(data).length; i++) {
      dataSql.push("'" + Object.values(data)[i] + "'");
    }

    if (columnsSql.indexOf("company_id") == -1) {
      columnsSql.push("company_id");
      dataSql.push("'" + _company_id + "'");
    }

    if (columnsSql.indexOf("order_id") == -1) {
      columnsSql.push("order_id");
      dataSql.push("'" + orderId + "'");
    }

    if (columnsSql.indexOf("station_for_order_id") == -1) {
      columnsSql.push("station_for_order_id");
      dataSql.push("'" + stationForOrderId + "'");
    }

    // let insertSql = `INSERT INTO passengers_for_order (${columnsSql.join()}) VALUES (${dataSql.join()});`;
    let insertSql =
      "INSERT INTO passengers_for_order (`" +
      columnsSql.join("`,`") +
      "`) VALUES (" +
      dataSql.join() +
      ")";

    const response = this.sequelize.query(insertSql);

    response
      .then((d) => res.status(200).send(d))
      .catch((err) => {
        res.createErrorLogAndSend({
          message: err.message || "Some error occurred while getting orders.",
        });
      });
  };

  removeRecord = async (req, res) => {
    const orderId = req.query.order_id;
    const passenger_for_order_id = req.query.id;
    // const passedDate = req.query.date;
    let _company_id = req.company_id;

    // Do not needed zone here

    if (!orderId && !passenger_for_order_id) {
      // return res.status(500).send({
      //     message: "Some error occurred while removing passenger for order - order_id or passenger_for_order_id: required.",
      // });
      return res.createErrorLogAndSend({
        message: "Some error occurred while removing passenger for order - order_id or passenger_for_order_id: required.",
      });
    }

    let orderWhere = "";
    orderWhere += orderId ? ` AND order_id = ${orderId} ` : "";
    orderWhere += passenger_for_order_id
      ? ` AND id = ${passenger_for_order_id} `
      : "";

    const response = this.sequelize.query(
      `DELETE FROM passengers_for_order WHERE company_id= ${_company_id} ${orderWhere}`
    );

    return response
      .then((d) => res.status(200).send(d))
      .catch((err) => {
        res.createErrorLogAndSend({
          message: err.message || "Some error occurred while removeing orders.",
        });
      });
  };

  movePassengersPlanner = async (req, res) => {
    let _company_id = req.company_id;

    const orderId = req.query.new_order_id;
    const passengerIds = req.query.passenger_ids;

    if (!orderId && !passengerIds) {
      // return res.status(500).send({
      //     message: "Some error occurred while moving passengers for order - new_order_id and passenger_ids: required.",
      // });
      return res.createErrorLogAndSend({
        message:
          "Some error occurred while moving passengers for order - new_order_id and passenger_ids: required.",
      });
    }

    let insertSql = `UPDATE passengers_for_order SET station_for_order_id = 1, order_id = ${orderId} WHERE id IN (${passengerIds}) and company_id = ${_company_id};`;

    const response = this.sequelize.query(insertSql);

    response
      .then((d) => res.status(200).send(d))
      .catch((err) => {
        // res.status(500).send({
        //     message:
        //         err.message ||
        //         "Some error occurred while updating passengers_for_order.",
        // });
        res.createErrorLogAndSend({
          message:
            err.message ||
            "Some error occurred while updating passengers_for_order.",
        });
      });
  };

  // get all passengers from selected station; table: passengers_for_order
  // get request: url: /api/v1/planner/passengers/get-all-passengers-for-station
  getAllPassengersForStation = async (req, res) => {
    const stationId = req.query.station_id;
    const _company_id = req.company_id;
    const _order_id = req.query.order_id;

    if (!stationId) {
      return res.createErrorLogAndSend({
        message:
          "Some error occurred while getting passengers for station - station_id: required.",
      });
    }

    const response = this.sequelize.query(
      `SELECT * FROM passengers_for_order WHERE station_for_order_id = ${stationId} AND company_id= ${_company_id}
      AND order_id = ${_order_id}`,
      { type: QueryTypes.SELECT }
    );

    response
      .then((d) => {
        res.status(200).send(d);
      })
      .catch((err) => {
        res.createErrorLogAndSend({
          message:
            err.message || "Some error occurred while getting passengers.",
        });
      });
  };

  // add passenger for station; table: passengers_for_order
  // post request; url: /api/v1/planner/passengers/add-passenger
  addPassengerForOrder = async (req, res) => {
    const data = req.body.data.payload;
    let _company_id = req.company_id;

    if (!data || Object.values(data).length == 0) {
      return res.createErrorLogAndSend({
        message:
          "Some error occurred while adding passenger for order - data: required.",
      });
    }

    let columnsSql = [];

    for (let i = 0; i < Object.values(data).length; i++) {
      columnsSql.push(Object.keys(data)[i]);
    }

    let dataSql = [];
    for (let i = 0; i < Object.values(data).length; i++) {
      dataSql.push("'" + Object.values(data)[i] + "'");
    }

    if (columnsSql.indexOf("company_id") == -1) {
      columnsSql.push("company_id");
      dataSql.push("'" + _company_id + "'");
    }

    let insertSql =
      "INSERT INTO passengers_for_order (`" +
      columnsSql.join("`,`") +
      "`) VALUES (" +
      dataSql.join() +
      ")";

    const response = this.sequelize.query(insertSql);

    response
      .then((d) => res.status(200).send(d))
      .catch((err) => {
        res.createErrorLogAndSend({
          message: err.message || "Some error occurred while adding passenger.",
        });
      });
  };

  // move passenger to another station; table: passengers_for_order
  // put request; url: /api/v1/planner/passengers/move-passenger
  movePassengerToAnotherStation = async (req, res) => {
    let _company_id = req.company_id;
    const data = req.body.data;
    const _passengers = data.passengers; // array of id
    const _new_station_for_order_id = data.new_station_for_order_id;
    const _order_id = data.order_id;

    if (!data || Object.values(data).length == 0) {
      return res.createErrorLogAndSend({
        message:
          "Some error occurred while moving passengers to another station",
      });
    }

    let updateSql = `UPDATE passengers_for_order 
    SET station_for_order_id = ${_new_station_for_order_id}  
    WHERE id IN (${_passengers}) 
    AND company_id = ${_company_id}
    AND order_id = ${_order_id};`;

    const response = this.sequelize.query(updateSql);

    response
      .then((d) => res.status(200).send(d))
      .catch((err) => {
        res.createErrorLogAndSend({
          message:
            err.message ||
            "Some error occurred while updating passengers station.",
        });
      });
  };

  // update passenger details; table: passengers_for_order
  // put request; url: /api/v1/planner/passengers/edit-passenger
  updatePassengerDetails = async (req, res) => {
    const data = req.body.data;
    let _company_id = req.company_id;
    let _id = req.body.id;

    if (!data || Object.values(data).length == 0) {
      return res.createErrorLogAndSend({
        message: "Some error occurred while updating passenger.",
      });
    }

    let updateSql = [];
    for (let i = 0; i < Object.values(data).length; i++) {
      updateSql.push(
        " `" + Object.keys(data)[i] + "` = '" + Object.values(data)[i] + "' "
      );
    }

    let updateSqlQuery = `UPDATE passengers_for_order SET ${updateSql.join()} 
    WHERE id = ${_id} 
    AND company_id = ${_company_id}; `;

    const response = this.sequelize.query(updateSqlQuery);

    response
      .then((d) => res.status(200).send(d))
      .catch((err) => {
        res.createErrorLogAndSend({
          message:
            err.message || "Some error occurred while updating passenger.",
        });
      });
  };

  // delete passenger from order; table: passengers_for_order
  // post request; url: /api/v1/planner/passengers/remove-passenger
  removePassengerFromOrder = async (req, res) => {
    const _order_id = req.body.order_id;
    const _ids = req.body.data.passengers_ids; // array of ids
    let _company_id = req.company_id;

    if (!_order_id) {
      return res.createErrorLogAndSend({
        message: "Some error occurred while removing passengers from order",
      });
    }

    let orderWhere = ` AND id IN(${_ids}) `;
    let deleteQuery = `DELETE FROM passengers_for_order WHERE company_id= ${_company_id} ${orderWhere}`;

    const response = this.sequelize.query(deleteQuery);

    return response
      .then((d) => {
        res.status(200).send(d);
      })
      .catch((err) => {
        res.createErrorLogAndSend({
          message:
            err.message ||
            "Some error occurred while removing station from order.",
        });
      });
  };
}

export default PassengersPlanner;
