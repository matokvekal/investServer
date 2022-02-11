import BaseControllerMobile from "./baseControllerMobile";
const CONFIG = require("../config/config.json");
const { QueryTypes } = require("sequelize");


class DriverControllerMobile extends BaseControllerMobile {
  // constructor(app, modelName, sequelize) {
  //   super(app, modelName, sequelize);
  // }


  // GET /
  getDriverDetails = async (req, res) => {
    try {
      let driverPhone = req.user.user_name;
      let response = await this.sequelize.query(
        `SELECT distinct D.*,C.company_name FROM drivers D left join companies C on D.company_id= C.company_id  WHERE D.phone_number = "${driverPhone}"  limit 1 `
        , { type: QueryTypes.SELECT }
        // `SELECT * FROM drivers WHERE phone_number = "${driverPhone}" `
        // , { type: QueryTypes.SELECT }
      );
      return res.send(response);
    } catch (e) {
      // return res.status(500).send({
      //   message:
      //     e.message || "Some error occurred while getting getDriver Details.",
      // });
      return await res.createErrorLogAndSend({ err: e.message || "Some error occurred while getting getDriver Details." });
    }
  };
  // GET /
  getReportsType = async (req, res) => {
    try {

      let response = await this.sequelize.query(
        `SELECT * FROM reports_type  `
        , { type: QueryTypes.SELECT }
      );
      return res.send(response);
    } catch (e) {
      // return res.status(500).send({
      //   message:
      //     e.message || "Some error occurred while getting reports_type.",
      // });
      return await res.createErrorLogAndSend({ err: e.message || "Some error occurred while getting reports_type." });
    }
  };

  // post /
  driverSendReport = async (req, res) => {
    try {
      let driverPhone = req.user.user_name;
      const { report_type_id, reported_time, data = null } = req.body;
      if (report_type_id && reported_time) {
        // console.log(`insert into driver_reports (driver_phone, report_type_id ,reported_time)values('${driverPhone}', ${report_type_id},'${reported_time}') `)
        const response = await this.sequelize.query(`insert into driver_reports (driver_phone, report_type_id ,reported_time)values('${driverPhone}', ${report_type_id},'${reported_time}') `);
        return res.send(response);
      }
      // return res.status(500).send({
      //   message: "error at driver send Report.",
      // });
      return await res.createErrorLogAndSend({ err: "error at driver send Report." });
    } catch (e) {
      // return res.status(500).send({
      //   message: e.message || "Some error occurred while driver Send Report.",
      // });
      return await res.createErrorLogAndSend({ err: e.message || "Some error occurred while driver Send Report." });
    }
  }

  // post /
  updateDriverLocation = async (req, res) => {
    let currentCompanyId = req.body.company_id;

    try {

      let driverPhone = req.user.user_name /*= 9720523949371*/;
      let status;
      let result = await this.sequelize.query(
        ` select in_transmit_mode,update_interval_sec from users where  user_name= '${driverPhone}'and company_id=${currentCompanyId} and user_role like '%driver%' `
        , { type: this.sequelize.QueryTypes.SELECT });

      if (result && result[0]) {
        if (
          currentCompanyId &&
          result[0].in_transmit_mode===1 &&
          req.body.lat &&
          req.body.long &&
          req.body.errorRadius &&  
          Number(req.body.errorRadius) <= Number(CONFIG.mobileRadiusError) &&
          req.body.plateNumber 
        ) {
          console.log(`CALL mobile_update_location(${currentCompanyId},'${req.body.plateNumber}','${req.body.lat}','${req.body.long}','${driverPhone}')`)
          await this.sequelize.query(
            `CALL mobile_update_location(${currentCompanyId},'${req.body.plateNumber}','${req.body.lat}','${req.body.long}','${driverPhone}');`
          );
          status = "updated";
        } else {
          status = "not updated";
        }
        let response = { transmit: result[0].in_transmit_mode, updateEvery: result[0].update_interval_sec, status: status };
        return res.send(response)
      } else {

        return await res.createErrorLogAndSend({ message: "Error at update driver Location driver not found." });
      }
    } catch (e) {
      return await res.createErrorLogAndSend({ message: e.message || "Error ar update update Driver Location." });
    }
  };



  addDriverData = async (req, res) => {
    const data = req.body.data;
    let _company_id = req.company_id;

    if (!data || Object.values(data).length == 0) {
      return res.createErrorLogAndSend({
        err: "Some error occurred while adding passenger for order - data: required."
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

    if (columnsSql.indexOf('company_id') == -1) {
      columnsSql.push('company_id');
      dataSql.push("'" + _company_id + "'");
    }

    // let insertSql = `INSERT INTO passengers_for_order (${columnsSql.join()}) VALUES (${dataSql.join()});`;
    let insertSql = 'INSERT INTO drivers (`' + columnsSql.join("`,`") + '`) VALUES (' + dataSql.join() + ')';

    const response = this.sequelize.query(insertSql);

    response
      .then(d =>
        res.status(200).send(d)
      )
      .catch((err) => {
        res.createErrorLogAndSend({
          err: err.message ||
            "Some error occurred while getting orders.",
        });
      });
  };


  updateDriverData = async (req, res) => {
    const data = req.body.data;
    const updateId = parseInt(req.query.id);
    let _company_id = req.company_id;

    if (!_company_id || !updateId) {
      return await res.createErrorLogAndSend({ message: "Some error occurred - company_id and id: required." });
    }

    if (!data || Object.values(data).length == 0) {
      return await res.createErrorLogAndSend({ message: "Some error occurred - data: required." });
    }

    let updateSql = [];
    let fire_base_token_passed = false;
    for (let i = 0; i < Object.values(data).length; i++) {
      updateSql.push(" `" + Object.keys(data)[i] + "` = '" + Object.values(data)[i] + "' ");
      if (Object.keys(data)[i] == 'fire_base_token') {
        fire_base_token_passed = true;
      }
    }
    if (fire_base_token_passed) {
      let now = new Date(new Date().toUTCString());
      updateSql.push(" `fire_base_token_recived` = '" + (now.getUTCFullYear() + '-' + (parseInt(now.getUTCMonth()) + 1) + '-' + (now.getUTCDate()) + ' ' + now.getUTCHours() + '-' + now.getUTCMinutes() + '-' + now.getUTCSeconds()) + "' ");
    }

    let updateSqlQuery = `UPDATE drivers SET ${updateSql.join()} WHERE id = ${updateId} AND company_id = ${_company_id}; `;

    const response = this.sequelize.query(updateSqlQuery);

    response
      .then(d =>
        res.status(200).send(d)
      )
      .catch((err) => {
        res.createErrorLogAndSend({ message: err.message || "Some error occurred while updatind drivers." });
      });
  }

}

export default DriverControllerMobile;
