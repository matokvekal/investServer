import BaseControllerPlanner from "./baseControllerPlanner";
const { QueryTypes } = require("sequelize");

class locationPlanner extends BaseControllerPlanner {
  constructor(app, modelName, sequelize) {
    super(app, modelName, sequelize);
  }
  //GET: chaperones
  getChaperones = async (req, res) => {
    try {
      let _company_id = req.company_id;

      const response = await this.sequelize.query(
        `SELECT * FROM chaperones WHERE company_id= ${_company_id}`,
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
