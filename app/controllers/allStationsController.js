import BaseController from "./baseController";
class AllStationsController extends BaseController {
  constructor(app, modelName) {
    super(app, modelName);
    this.modelName = "all_stations";
  }

  getAllStations(req, res) {
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
        //   message: err.message || "Some error occurred while getting all stations."
        //   ,
        // });
        res.createErrorLogAndSend({ err: err.message || "Some error occurred while getting all stations." });
      });
  }
}

export default AllStationsController;
