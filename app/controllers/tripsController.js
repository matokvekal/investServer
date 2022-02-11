import BaseController from "./baseController";
let tripsService;

class TripsController extends BaseController {
  constructor(app, modelName) {
    super(app, modelName);

    tripsService = require("../services/tripsService")(this.dbModel);
  }

  // GET /trips
  getTrips(req, res) {
    let tripData;
    let where = [];

    let _company_id = req.company_id;
    where.push({ company_id: _company_id });

    if (req.query.resource_id) {
      where.push({ resource_id: req.query.resource_id })
    }

    // TODO only some attributes
    tripData = tripsService.getAllTrips(where);

    tripData
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        // res.status(500).send({
        //   message:
        //     err.message || "Some error occurred while getting trips."
        // });
        res.createErrorLogAndSend({ err: err.message || "Some error occurred while getting trips." });
      });

  }

  // POST /trips/add
  addStation(req, res) {
    this.dbModel.create(req.body)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        // res.status(500).send({
        //   message: err.message || "Some error occurred while creating trips.",
        // });
        res.createErrorLogAndSend({ err: err.message || "Some error occurred while creating trips." });
      });
  }

  // POST /trips/add-bulk
  addBulkTrips(req, res) {
    this.dbModel.bulkCreate(req.body)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        // res.status(500).send({
        //   message:
        //     err.message || "Some error occurred while bulk creating trips.",
        // });
        res.createErrorLogAndSend({ err: err.message || "Some error occurred while bulk creating trips." });
      });
  }
}

export default TripsController;
