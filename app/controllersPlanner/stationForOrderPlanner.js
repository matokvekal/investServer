import BaseControllerPlanner from "./baseControllerPlanner";
const { QueryTypes } = require("sequelize");

class StationForOrderPlanner extends BaseControllerPlanner {
  constructor(app, modelName, sequelize) {
    super(app, modelName, sequelize);
  }

  getAllRecords = async (req, res) => {
    const orderId = req.query.order_id;
    const passedDate = req.query.date;
    let _company_id = req.company_id;

    // Do not needed zone here

    if (!orderId) {
      // return res.status(500).send({
      //     message: "Some error occurred while getting driver widget - order_id: required.",
      // });
      res.createErrorLogAndSend({
        message:
          "Some error occurred while getting driver widget - order_id: required.",
      });
    }

    let sqlZone = "1";

    let sqlDate = "";
    if (passedDate) {
      sqlDate = ` AND time_to_arrive < '${passedDate}' AND time_to_live > '${passedDate}' `;
    }

    let orderWhere = ` AND order_id = ${orderId} `;

    const response = this.sequelize.query(
      `SELECT * FROM stations_for_order WHERE ${sqlZone} ${sqlDate} AND company_id= ${_company_id} ${orderWhere}`,
      { type: QueryTypes.SELECT }
    );

    response
      .then((d) => res.status(200).send(d))
      .catch((err) => {
        // res.status(500).send({
        //     message:
        //         err.message ||
        //         "Some error occurred while getting orders.",
        // });
        res.createErrorLogAndSend({
          message: err.message || "Some error occurred while getting orders.",
        });
      });
  };

  addRecord = async (req, res) => {
    const data = req.body.data;
    let _company_id = req.company_id;

    // Do not zone needed

    if (!data || Object.values(data).length == 0) {
      // return res.status(500).send({
      //     message: "Some error occurred while adding station for order - data: required.",
      // });
      return res.createErrorLogAndSend({
        message: "Some error occurred while adding station for order - data: required.",
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

    // if (columnsSql.indexOf('station_order') == -1) {
    //     columnsSql.push('station_order');
    //     dataSql.push("'" + _zones + "'");
    // }

    // let insertSql = `INSERT INTO stations_for_order (${columnsSql.join()}) VALUES (${dataSql.join()});`;
    let insertSql =
      "INSERT INTO stations_for_order (`" +
      columnsSql.join("`,`") +
      "`) VALUES (" +
      dataSql.join() +
      ")";

    const response = this.sequelize.query(insertSql);

    response
      .then((d) => res.status(200).send(d))
      .catch((err) => {
        // res.status(500).send({
        //     message:
        //         err.message ||
        //         "Some error occurred while getting orders.",
        // });
        res.createErrorLogAndSend({
          message: err.message || "Some error occurred while getting orders.",
        });
      });
  };

  removeRecord = async (req, res) => {
    const orderId = req.query.order_id;
    // const passedDate = req.query.date;
    let _company_id = req.company_id;

    // Do not needed zone here

    if (!orderId) {
      return res.createErrorLogAndSend({
        message: "Some error occurred while removing station for order - order_id: required.",
      });
    }

    let orderWhere = ` AND order_id = ${orderId} `;

    const response = this.sequelize.query(
      `DELETE FROM stations_for_order WHERE company_id= ${_company_id} ${orderWhere}`
    );

    return response
      .then((d) => res.status(200).send(d))
      .catch((err) => {
        res.createErrorLogAndSend({
          message: err.message || "Some error occurred while removing orders.",
        });
      });
  };

  //create station for order; table: stations_for_order
  // post request on  url: /api/v1/planner/stations-for-order/add-station
  createStationForOrder = async (req, res) => {
    const data = req.body;
    let _company_id = req.company_id;

    if (!data || Object.values(data).length == 0) {
      return res.createErrorLogAndSend({
        message:
          "Some error occurred while creating station for order - data: required.",
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
      "INSERT INTO stations_for_order (`" +
      columnsSql.join("`,`") +
      "`) VALUES (" +
      dataSql.join() +
      ")";

    const response = this.sequelize.query(insertSql);

    response
      .then((d) => res.status(200).send("Successfully created station"))
      .catch((err) => {
        res.createErrorLogAndSend({
          message:
            err.message ||
            "Some error occurred while creating station for order.",
        });
      });
  };

  //change station details; table: stations_for_order
  // put request on url: /api/v1/planner/stations-for-order/edit-station
  changeStationDetails = async (req, res) => {
    const data = req.body;
    let _company_id = req.company_id;
    let _station_id = data.id;

    if (!data || Object.values(data).length == 0) {
      return res.createErrorLogAndSend({
        message: "Some error occurred while editing station details",
      });
    }

    let updateSql = [];
    for (let i = 0; i < Object.values(data).length; i++) {
      updateSql.push(
        " `" + Object.keys(data)[i] + "` = '" + Object.values(data)[i] + "' "
      );
    }

    let updateSqlQuery = `UPDATE stations_for_order SET ${updateSql.join()} 
    WHERE id = ${_station_id} 
    AND company_id = ${_company_id}; `;

    const response = this.sequelize.query(updateSqlQuery);
    response
      .then((d) => res.status(200).send(d))
      .catch((err) => {
        res.createErrorLogAndSend({
          message:
            err.message || "Some error occurred while editing station details.",
        });
      });
  };

  //move station to another order; table: stations_for_order
  // put request on url: /api/v1/planner/stations-for-order/transfer-station
  moveStationToAnotherOrder = async (req, res) => {
    const data = req.body.data;
    let _company_id = req.company_id;
    let _station_id = req.body.id;

    if (!data || Object.values(data).length == 0) {
      return res.createErrorLogAndSend({
        message: "Some error occurred while editing station details",
      });
    }

    let updateSql = [];
    for (let i = 0; i < Object.values(data).length; i++) {
      updateSql.push(
        " `" + Object.keys(data)[i] + "` = '" + Object.values(data)[i] + "' "
      );
    }

    let updateSqlQuery = `UPDATE stations_for_order SET ${updateSql.join()} 
    WHERE id = ${_station_id} 
    AND company_id = ${_company_id}; `;

    const response = this.sequelize.query(updateSqlQuery);
    response
      .then((d) => res.status(200).send(d))
      .catch((err) => {
        res.createErrorLogAndSend({
          message:
            err.message || "Some error occurred while editing station details.",
        });
      });
  };

  //remove station from order; table: stations_for_order
  // post request on url: /api/v1/planner/stations-for-order/remove-station
  removeStationFromOrder = async (req, res) => {
    const stationId = req.body.data.id;
    let _company_id = req.company_id;

    if (!stationId) {
      return res.createErrorLogAndSend({
        message:
          "Some error occurred while removing station from order - station_Id: required.",
      });
    }

    let orderWhere = ` AND id = ${stationId} `;

    const response = this.sequelize.query(
      `DELETE FROM stations_for_order WHERE company_id= ${_company_id} ${orderWhere}`
    );

    return response
      .then((d) => res.status(200).send(d))
      .catch((err) => {
        res.createErrorLogAndSend({
          message:
            err.message ||
            "Some error occurred while removing station from order.",
        });
      });
  };
}

export default StationForOrderPlanner;
