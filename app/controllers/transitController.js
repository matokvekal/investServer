import BaseController from "./baseController";
class TransitController extends BaseController {

  // GET /transit
  getTransit(req, res) {
    let where = [];

    let _company_id = req.company_id;
    where.push({ company_id: _company_id });

    this.dbModel.findAll({ where: where })
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        // res.status(500).send({
        //   message: err.message || "Some error occurred while getting transit.",
        // });
        res.createErrorLogAndSend({ err: err.message || "Some error occurred while getting transit." });
      });
  }

  // POST /transit/add
  addStation(req, res) {
    this.dbModel.create(req.body)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        // res.status(500).send({
        //   message: err.message || "Some error occurred while creating transit.",
        // });
        res.createErrorLogAndSend({ err: err.message || "Some error occurred while creating transit." });
      });
  }

  // POST /transit/add-bulk
  addBulkTransit(req, res) {
    this.dbModel.bulkCreate(req.body)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        // res.status(500).send({
        //   message:
        //     err.message || "Some error occurred while bulk creating transit.",
        // });
        res.createErrorLogAndSend({ err: err.message || "Some error occurred while bulk creating transit." });
      });
  }
}
export default TransitController;
