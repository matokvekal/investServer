import BaseControllerPlanner from "./baseControllerPlanner";
const { QueryTypes } = require("sequelize");

class OrdersPlanner extends BaseControllerPlanner {
  constructor(app, modelName, sequelize) {
    super(app, modelName, sequelize);
  }

  getAllRecords = async (req, res) => {
    const passedDate = req.query.date;
    const orderStatus = req.query.order_status || "0";
    let _company_id = req.company_id;

    const _zones = req.user.zones;
    const _zoneArr = _zones.split(",");

    let sqlZone = "";
    _zoneArr.map(
      (z, i) =>
        (sqlZone +=
          `scopes LIKE "%${z}%"` + (_zoneArr.length > i + 1 ? " OR " : ""))
    );
    if (sqlZone) {
      sqlZone = " (" + sqlZone + ") ";
    }

    let sqlDate = "";
    if (passedDate) {
      sqlDate = ` AND start < '${passedDate}' AND end > '${passedDate}' `;
    }

    let orderStatusWhere = ` AND order_status = ${orderStatus} `;

    const response = this.sequelize.query(
      `SELECT * FROM orders WHERE ${sqlZone} ${sqlDate} AND company_id= ${_company_id} ${orderStatusWhere}`,
      { type: QueryTypes.SELECT }
    );

    response
      .then((d) => res.status(200).send(d))
      .catch((err) => {
        return res.createErrorLogAndSend({
          message: err.message || "Some error occurred while getting orders.",
        });
      });
  };

  // GET /api/v1/planner/orders/open-orders
  getOpenOrders = async (req, res) => {
    try {
      const startDate = req.query.startDate;
      let companyId = req.company_id;

      const zones = req.user.zones;
      if (!startDate || !zones || zones === "") {
        return await res.createErrorLogAndSend({
          message: "Some error occurred while Open-Orders",
        });
      }

      const _zoneArr = zones.split(",");
      let sqlZone;

      _zoneArr.forEach((zone) => {
        sqlZone = sqlZone
          ? sqlZone + ` OR FIND_IN_SET("${zone}",scopes)`
          : ` FIND_IN_SET("${zone}",scopes)`;
      });

      let response = await this.sequelize.query(
        `SELECT O.* FROM 
        orders O
        LEFT JOIN planning P 
        ON P.order_id = O.id
        WHERE 
        P.id IS NULL and 
        O.company_id =${companyId} and 
        ( ${sqlZone} ) and
        O.start >= "${startDate}"; `,
        { type: QueryTypes.SELECT }
      );
      return res.send(response);
    } catch (e) {
      return await res.createErrorLogAndSend({
        message: e.message || "Some error occurred while Open-Orders.",
      });
    }
  };

  //POST => /api/v1/planner/orders/new-order
  addNewOrder = async (req, res) => {
    const data = req.body;
    let _company_id = req.company_id;
    let _order_id;
    let _bank_id;

    try {
      const orderOperations = await this.createOrder(
        req,
        res,
        data,
        _company_id
      );
      _order_id = orderOperations[0];
      res.status(200).send("Successfully created order !");
    } catch (error) {
      res.createErrorLogAndSend({
        message:
          error.message || "Some error occurred while creating new order.",
      });
    }

    try {
      const bankOperations = await this.getOrCreateRecordFromBank(
        req,
        res,
        data,
        _company_id,
        _order_id
      );

      // check if record in resource_bank is new or already exist
      if (bankOperations["existing"] === "existing") {
        _bank_id = bankOperations["existingRecord"][0].id;
      } else if (bankOperations["existing"] === "new") {
        _bank_id = bankOperations["newlyAdded"][0];
      }

      try {
        await this.createNewRecordInPlanning(
          req,
          res,
          data,
          _company_id,
          _order_id,
          _bank_id
        );
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  };
  // private for addNewOrder
  createOrder = (req, res, data, _company_id) => {
    const orderData = {
      trip_name: data.trip_name,
      type_id: data.type_id,
      passengers: data.passengers,
      chaperon: data.chaperon,
      customer_id: data.customer_id,
      customer_name: data.customer_name,
      contact_person_phone: data.contact_person_phone,
      contact_person_name: data.contact_person_name,
      comment_for_planner: data.comment_for_planner,
      comment_for_driver: data.comment_for_driver,
    };

    if (!data || Object.values(data).length == 0) {
      return res.createErrorLogAndSend({
        message: "Some error occurred while creating order - data: required.",
      });
    }

    let columnsSql = [];
    for (let i = 0; i < Object.values(orderData).length; i++) {
      columnsSql.push(Object.keys(orderData)[i]);
    }

    let dataSql = [];

    for (let i = 0; i < Object.values(orderData).length; i++) {
      dataSql.push("'" + Object.values(orderData)[i] + "'");
    }

    if (columnsSql.indexOf("company_id") == -1) {
      columnsSql.push("company_id");
      dataSql.push("'" + _company_id + "'");
    }

    let insertSql =
      "INSERT INTO orders (`" +
      columnsSql.join("`,`") +
      "`) VALUES (" +
      dataSql.join() +
      ")";

    return this.sequelize.query(insertSql, { type: QueryTypes.INSERT });
  };
  // private for addNewOrder
  getOrCreateRecordFromBank = async (
    req,
    res,
    data,
    _company_id,
    _order_id
  ) => {
    let _vehicleId = null;
    let _driverId = null;

    if (data.driver_id || data.car_number) {
      _vehicleId = data.vehicle_id ? data.vehicle_id : null;
      _driverId = data.driver_id ? data.driver_id : null;

      // check if there are same record in resource bank

      let bankSelectQuery = `SELECT * FROM resource_bank WHERE
        vehicle_id = ${_vehicleId} AND driver_id = ${_driverId} AND company_id = ${_company_id};`;

      const existingRecord = await this.sequelize.query(bankSelectQuery, {
        type: QueryTypes.SELECT,
      });

      if (existingRecord.length > 0) {
        return await {
          existing: "existing",
          existingRecord,
        };
      } else if (_company_id && (_vehicleId || _driverId)) {
        // create record in bank
        const newlyAdded = await this.sequelize.query(
          `INSERT INTO resource_bank (company_id,vehicle_id,driver_id) VALUES (${_company_id}, ${_vehicleId}, ${_driverId})`
        );
        return await {
          existing: "new",
          newlyAdded,
        };
      } else {
        throw "Error occurred while processing resource bank !";
      }
    }
  };
  // private for addNewOrder
  createNewRecordInPlanning = async (
    req,
    res,
    data,
    _company_id,
    _order_id,
    _bank_id
  ) => {
    // create new record in planning table
    const planningData = {
      company_id: _company_id,
      order_id: _order_id,
      resource_bank_id: _bank_id,
      chapeeron_id: data.chaperon,
    };

    let columnsSql = [];
    for (let i = 0; i < Object.values(planningData).length; i++) {
      columnsSql.push(Object.keys(planningData)[i]);
    }

    let dataSql = [];
    for (let i = 0; i < Object.values(planningData).length; i++) {
      dataSql.push("'" + Object.values(planningData)[i] + "'");
    }

    if (columnsSql.indexOf("company_id") == -1) {
      columnsSql.push("company_id");
      dataSql.push("'" + _company_id + "'");
    }

    let insertSql =
      "INSERT INTO planning (`" +
      columnsSql.join("`,`") +
      "`) VALUES (" +
      dataSql.join() +
      ")";
    return this.sequelize.query(insertSql);
  };

  // POST => /api/v1/planner/orders/clone-order
  duplicateOrder = async (req, res) => {
    const data = req.body;

    let _company_id = req.company_id;
    let _order_id = data.order_id;

    // get existing

    let orderSelectQuery = `SELECT * FROM orders WHERE
    id = ${_order_id} AND company_id = ${_company_id};`;

    let existingRecord = await this.sequelize.query(orderSelectQuery, {
      type: QueryTypes.SELECT,
    });

    console.log("existingRecord", existingRecord[0]);
    // create new one
    if (existingRecord) {
      delete existingRecord[0]["id"];
      let orderData = existingRecord[0];
      let columnsSql = [];
      for (let i = 0; i < Object.values(orderData).length; i++) {
        columnsSql.push(Object.keys(orderData)[i]);
      }

      let dataSql = [];

      for (let i = 0; i < Object.values(orderData).length; i++) {
        dataSql.push("'" + Object.values(orderData)[i] + "'");
      }

      if (columnsSql.indexOf("company_id") == -1) {
        columnsSql.push("company_id");
        dataSql.push("'" + _company_id + "'");
      }

      let insertSql =
        "INSERT INTO orders (`" +
        columnsSql.join("`,`") +
        "`) VALUES (" +
        dataSql.join() +
        ")";

      console.log("insertSql:", insertSql);

      this.sequelize
        .query(insertSql, { type: QueryTypes.INSERT })
        .then((o) => res.status(200).send(o))
        .catch((err) => {
          res.createErrorLogAndSend({
            message: err.message || "Some error occurred while clone order.",
          });
        });
    }
  };

  // POST => /api/v1/planner/orders/remove-order
  removeOrder = async (req, res) => {
    const data = req.body;

    let _company_id = req.company_id;
    let _order_id = data.order_id;

    // delete in orders table

    let deletingQuery = `DELETE FROM orders WHERE
    id = ${_order_id} AND company_id = ${_company_id};`;

    await this.sequelize
      .query(deletingQuery)
      .then((d) => res.status(200).send(d))
      .catch((err) => {
        res.createErrorLogAndSend({
          message: err.message || "Some error occurred while deleting order.",
        });
      });

    // delete from planning table if exist

    let deletingPlanning = `DELETE FROM planning WHERE
      order_id = ${_order_id} AND company_id = ${_company_id};`;

    try {
      await this.sequelize.query(deletingPlanning);
    } catch (error) {
      console.log(error);
    }
  };

  updateOrder = async (req, res) => {
    //     also same, check if you need to update data at orders
    // or if you need to update at planning.

    // If user update driver/car - you do it at planning,
    //  but id=f the combination of driver and vehicle not exist,
    
    //   you have to create row at resource_bank_id,
    //   then update  at planning
  };
}
export default OrdersPlanner;
