const { QueryTypes } = require("sequelize");
import BaseControllerPlanner from "./baseControllerPlanner";

class TasksControllerPlanner extends BaseControllerPlanner {
  constructor(app, modelName, sequelize) {
    super(app, modelName, sequelize);
  }
//GET
  getCurrentTasks = (req, res) => {
    const passedDate = req.query.date;
    const _company_id = req.company_id;
    const _zones = req.user.zones;
    const _zoneArr = _zones.split(",");

    let sqlZone = "";
    _zoneArr.map(
      (z, i) =>
      (sqlZone +=
        `car_scopes LIKE "%${z}%"` + (_zoneArr.length > i + 1 ? " OR " : ""))
    );

    if (sqlZone) {
      sqlZone = '(' + sqlZone + ')';
    }

    const response = this.sequelize.query(
      "SELECT * FROM v_tasks WHERE " +
      sqlZone +
      (
        passedDate ? (
          " AND " +
          `"` +
          passedDate +
          `"` +
          " between trip_start and trip_end") : ''
      )
      +
      " AND company_id=" +
      _company_id,
      {
        type: QueryTypes.SELECT,
      }
    );

    response
      .then(data =>
        res.status(200).send(
          data
        )
      )
      .catch((err) => {
        // res.status(500).send({
        //   message: err.message || "Some error occurred while getting tasks.",
        // });
        res.createErrorLogAndSend({
          message: err.message ||
            "Some error occurred while getting tasks.",
        });
      });
  };
}

export default TasksControllerPlanner;
