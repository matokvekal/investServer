import BaseController from "./baseController";
const { QueryTypes } = require("sequelize");

class CompanyController extends BaseController {
  constructor(app, modelName, sequelize) {
    super(app, modelName, sequelize);
  }

  // GET /company
  getCompany(req, res) {
    let where = [];

    let _company_id = req.company_id;
    where.push({ company_id: _company_id });

    this.dbModel
      .findAll({ where: where })
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        // res.status(500).send({
        //   message: err.message || "Some error occurred while getting company.",
        // });
        res.createErrorLogAndSend({ err: err.message || "Some error occurred while getting company." });
      });
  }

  // GET /company-events
  companyEvents = async (req, res) => {
    let resp = {};
    let company_id = req.query.company_id;

    if (!company_id) {
      return res.createErrorLogAndSend({ message: "Param: company_id not found." });
    }

    try {
      resp = await this.sequelize.query(`SELECT * FROM company_events WHERE company_id = ${company_id}`, { type: QueryTypes.SELECT });
      return res.send(resp);
    } catch (e) {
      return await res.createErrorLogAndSend({ message: e.message || "Some error occurred while getting company events" });
    }
  }

  // GET /company-rules
  companyRules = async (req, res) => {
    let resp = {};
    let company_id = req.query.company_id;

    if (!company_id) {
      return res.createErrorLogAndSend({ message: "Param: company_id not found." });
    }

    try {
      resp = await this.sequelize.query(`SELECT * FROM company_rules WHERE company_id = ${company_id}`, { type: QueryTypes.SELECT });
      return res.send(resp);
    } catch (e) {
      return await res.createErrorLogAndSend({ message: e.message || "Some error occurred while getting company rules" });
    }
  }


  // GET /dictionary
  dictionary = async (req, res) => {
    let resp = {};
    let company_id = req.query.company_id;

    if (!company_id) {
      return res.createErrorLogAndSend({ message: "Param: company_id not found." });
    }

    try {
      resp = await this.sequelize.query(`SELECT * FROM dictionary WHERE company_id = ${company_id}`, { type: QueryTypes.SELECT });
      return res.send(resp);
    } catch (e) {
      return await res.createErrorLogAndSend({ message: e.message || "Some error occurred while getting dictionary" });
    }
  }

  // POST /company/add
  addStation(req, res) {
    this.dbModel.create(req.body)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        // res.status(500).send({
        //   message: err.message || "Some error occurred while creating company.",
        // });
        res.createErrorLogAndSend({ err: err.message || "Some error occurred while creating company." });
      });
  }

  // POST /company/add-bulk
  addBulkCompany(req, res) {
    this.dbModel.bulkCreate(req.body)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        // res.status(500).send({
        //   message:
        //     err.message || "Some error occurred while bulk creating company.",
        // });
        res.createErrorLogAndSend({ err: err.message || "Some error occurred while bulk creating company." });
      });
  }

}
export default CompanyController;
