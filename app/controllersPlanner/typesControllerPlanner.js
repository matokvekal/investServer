import BaseControllerPlanner from "./baseControllerPlanner";

let typesService;

class TypesControllerPlanner extends BaseControllerPlanner {
  constructor(app, modelName, sequelize) {
    super(app, modelName, sequelize);
    const _dbModel = this.app.get("dbModels")["types"];
    typesService = require("../services/typesService")(_dbModel);
  }

  getColors = async (req, res) => {
    const colors = await typesService
      .getAllTypes()
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        // res.status(500).send({
        //   message: err.message || "Some error occurred while getting types.",
        // });
        res.createErrorLogAndSend({
          err: err.message ||
            "Some error occurred while getting types.",
        });
      });
  };
}
export default TypesControllerPlanner;
