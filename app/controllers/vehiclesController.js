import BaseController from "./baseController";

class VehiclesController extends BaseController {
  // GET /vehicles
  getVehicles(req, res) {
    this.dbModel
      .findAll()
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((err) => {
        // res.status(500).send({
        //   message: err.message || "Some error occurred while getting vehicles.",
        // });
        res.createErrorLogAndSend({ err: err.message || "Some error occurred while getting vehicles." });
      });
  }

  // POST /vehicles/add
  addVehicle(req, res) {
    this.dbModel.create(req.body)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        // res.status(500).send({
        //   message:
        //     err.message || "Some error occurred while creating vehicles.",
        // });
        res.createErrorLogAndSend({ err: err.message || "Some error occurred while creating vehicles." });
      });
  }

  // POST /vehicles/add-bulk
  addBulkVehicles(req, res) {
    this.dbModel.bulkCreate(req.body)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        // res.status(500).send({
        //   message:
        //     err.message || "Some error occurred while bulk creating vehicles.",
        // });
        res.createErrorLogAndSend({ err: err.message || "Some error occurred while bulk creating vehicles." });
      });
  }
}
export default VehiclesController;
