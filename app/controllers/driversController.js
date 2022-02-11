import BaseController from "./baseController";
class DriversController extends BaseController {

  // GET /drivers
  getDrivers(req, res) {
    let where = [];

    if (req.query.id) {
      req.zones = validFoundUser.zones;
      where.push({ id: parseInt(req.query.id) });
    } else {
      let _company_id = req.company_id;
      where.push({ company_id: _company_id });
    }

    this.dbModel.findAll({ where })
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        // res.status(500).send({
        //   message: err.message || "Some error occurred while getting drivers.",
        // });
        res.createErrorLogAndSend({ err: err.message || "Some error occurred while getting drivers." });
      });
  }

  // POST /drivers/add
  addDriver(req, res) {
    this.dbModel.create(req.body)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        // res.status(500).send({
        //   message: err.message || "Some error occurred while creating driver.",
        // });
        res.createErrorLogAndSend({ err: err.message || "Some error occurred while creating driver." });
      });
  }

  // POST /drivers/add-bulk
  addBulkDrivers(req, res) {
    this.dbModel.bulkCreate(req.body)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        // res.status(500).send({
        //   message:
        //     err.message || "Some error occurred while bulk creating drivers.",
        // });
        res.createErrorLogAndSend({ err: err.message || "Some error occurred while bulk creating drivers." });
      });
  }

}
export default DriversController;
