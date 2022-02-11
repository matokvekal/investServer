import BaseController from "./baseController";

class StationsController extends BaseController {

  // GET /stations
  getStations(req, res) {
    let where = [];

    let _company_id = req.company_id;
    where.push({ company_id: _company_id });

    if (req.query.trip_id) {
      where.push({ trip_id: req.query.trip_id });
    }
    if (req.query.id) {
      where.push({ id: req.query.id });
    }
    if (req.query.station_index) {
      where.push({ station_index: req.query.station_index });
    }

    this.dbModel.findAll({ where: where })
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        // res.status(500).send({
        //   message: err.message || "Some error occurred while getting stations.",
        // });
        res.createErrorLogAndSend({ err: err.message || "Some error occurred while getting stations." });
      });
  }

  // POST /stations/add
  addStation(req, res) {
    this.dbModel.create(req.body)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        // res.status(500).send({
        //   message:
        //     err.message || "Some error occurred while creating stations.",
        // });
        res.createErrorLogAndSend({ err: err.message || "Some error occurred while creating stations." });
      });
  }

  // POST /stations/add-bulk
  addBulkStations(req, res) {
    this.dbModel.bulkCreate(req.body)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        // res.status(500).send({
        //   message:
        //     err.message || "Some error occurred while bulk creating stations.",
        // });
        res.createErrorLogAndSend({ err: err.message || "Some error occurred while bulk creating stations." });
      });
  }
}
export default StationsController;
