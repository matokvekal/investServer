import BaseControllerPlanner from "./baseControllerPlanner";
const { QueryTypes } = require("sequelize");

class CustomersControllerPlanner extends BaseControllerPlanner {
  constructor(app, modelName, sequelize) {
    super(app, modelName, sequelize);
  }

  // /api/v1/planner/customers => GET
  getAllCustomers = async (req, res) => {
    let _company_id = req.company_id;

    let selectQuery = `SELECT * FROM customers WHERE company_id= ${_company_id}`;

    this.sequelize
      .query(selectQuery, { type: QueryTypes.SELECT })
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.createErrorLogAndSend({
          message:
            err.message || "Some error occurred while getting customers.",
        });
      });
  };
}
export default CustomersControllerPlanner;
