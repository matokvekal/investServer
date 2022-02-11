import BaseController from "./baseController";

class FixedFilterController extends BaseController {
  constructor(app, modelName) {
    super(app, modelName);
    this.modelName = "fixed_filter";
  }

  getFixedFilters(req, res) {
    const _company_id = req.company_id;
    this.dbModel
      .findAll({
        where: {
          // resource_id: req.query.resource_id, // if is needed  
          company_id: _company_id,
        },
      })
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        // res.status(500).send({
        //   message:
        //     err.message || "Some error occurred while getting fixed filters.",
        // });
        res.createErrorLogAndSend({ err: err.message || "Some error occurred while getting fixed filters." });
      });
  }
}

export default FixedFilterController;
