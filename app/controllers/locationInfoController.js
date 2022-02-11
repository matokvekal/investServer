import BaseController from "./baseController";
const { Op } = require("sequelize");
const moment = require('moment');

class LocationInfoController extends BaseController {
  constructor(modelName) {
    super(modelName);
    this.modelName = "location_info";
  }

  // GET /location-info
  getLocationInfo(req, res) {
    let resourcesData;
    let where = [];

    let _company_id = req.company_id;
    where.push({ company_id: _company_id });

    if (req.query.id) {
      resourcesData = this.dbModel.findOne({ where: { id: parseInt(req.query.id) } });
    } else {

      if (req.query.plate_number) {
        where.push({ plate_number: parseInt(req.query.plate_number) });
      }

      if (req.query.last_x_mins) {
        where.push({
          createdAt: {
            [Op.gt]: moment.utc().subtract(parseInt(req.query.last_x_mins), 'm')
          }
        });
      }

      resourcesData = this.dbModel.findAll({ where: where });
    }

    resourcesData
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        // res.status(500).send({
        //   message:
        //     err.message || "Some error occurred while getting location info.",
        // });
        res.createErrorLogAndSend({ err: err.message || "Some error occurred while getting location info." });
      });
  }

}
export default LocationInfoController;
