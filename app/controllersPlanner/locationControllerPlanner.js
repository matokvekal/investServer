import BaseControllerPlanner from "./baseControllerPlanner";
const { QueryTypes } = require("sequelize");

class locationPlanner extends BaseControllerPlanner {
  constructor(app, modelName, sequelize) {
    super(app, modelName, sequelize);
  }
  //GET: car-locations
  getCarLocations = async (req, res) => {
    try {
      const _startTime = req.query.startTime;
      const _endTime = req.query.endTime;
      const _carNumber = req.query.carNumber;
      let _company_id = req.company_id;

      if (!_startTime || !_endTime || !_carNumber || !_company_id) {
        return res.createErrorLogAndSend({
          err: "some params are missing to complete the request",
        });
      }

      let sqlDate = `last_location_time BETWEEN '${_startTime}' AND '${_endTime}'`;
      let sqlCarNumber = ` AND plate_number = ${_carNumber} `;

      const response = await this.sequelize.query(
        `SELECT * FROM location_infos WHERE ${sqlDate} ${sqlCarNumber} AND company_id= ${_company_id}`,
        { type: QueryTypes.SELECT }
      );
      return res.status(200).send(response);
    } catch (err) {
      return res.createErrorLogAndSend({
        err: err.message || "Some error occurred while getting locations.",
      });
    }
  };
}

export default locationPlanner;
