import { takeZones } from "../utils/splitRequest";
import BaseController from "./baseController";
const { Op } = require("sequelize");

class FilterController extends BaseController {
  // GET Typed in filter on each key stroke to fill autocomplete options
  constructor(app, modelName) {
    super(app, modelName);
    this.modelName = "resources";
  }

  getFilteredData = (req, res) => {
    let reqData = req.query["0"];

    let rawData = reqData.split("/ids")[0];

    let filterData = rawData.replace("data=", "");
    let _ids = reqData.split("=").pop();
    // last 5 searched records
    let _idArray = _ids ? JSON.parse(_ids) : [];

    let car = "car";
    let driver = "driver";
    let data = [];
    let carsWhere = [];
    let driversWhere = [];

    let _company_id = req.company_id;

    // prepared where clause
    let zone = takeZones(req.user.zones);

    // make call to show only last 5 searches
    if (filterData.length === 0 && _idArray.length > 0) {
      const condition = [];
      const whereIds = [];
      for (let index = 0; index < _idArray.length; index++) {
        const element = _idArray[index].id;
        whereIds.push({ [Op.or]: { id: element } });
      }

      condition.push({ [Op.or]: whereIds });

      this.dbModel
        .findAll({
          attributes: [
            "resource_type",
            "line_description",
            "car_number",
            "driver_nick_name",
            "driver_first_name",
            "driver_last_name",
            "driver_phone",
            "id",
            "company_id",
            "zone",
            "latitude",
            "longitude",
          ],
          limit: 10,
          where: condition,
        })
        .then((initialResources) => {
          let found = initialResources;

          const sortedResults = [];
          // sort and add correct resource type
          _idArray.map((element) => {
            found.map((used) => {
              if (element.id === used.id) {
                used.resource_type = element.type;
                sortedResults.unshift(used);
              }
            });
          });
          return res.json(sortedResults);
        })
        .catch((err) => {
          res.createErrorLogAndSend({
            err: err.message || "Some error occurred while getting resources.",
          });
        });
    } else {
      carsWhere.push(zone);
      driversWhere.push(zone);

      carsWhere.push({ company_id: _company_id });
      driversWhere.push({ company_id: _company_id });

      carsWhere.push({
        [Op.and]: [
          {
            car_number: {
              [Op.like]: `%${filterData}%`,
            },
          },
          {
            resource_type: {
              [Op.like]: `%${car}%`,
            },
          },
        ],
      });

      this.dbModel
        .findAll({
          order: [["car_number", "ASC"]],
          attributes: [
            "resource_type",
            "line_description",
            "car_number",
            "driver_nick_name",
            "driver_first_name",
            "driver_last_name",
            "driver_phone",
            "id",
            "company_id",
            "zone",
            "latitude",
            "longitude",
          ],
          limit: 10,
          where: carsWhere,
        })
        .then((foundCars) => {
          let _cars = foundCars;
          _cars.map((car) => (car.resource_type = "car"));
          data.push(..._cars);
        });

      const searchedDrivers = [];
      for (let i = 0; i < filterData.length; i++) {
        searchedDrivers.push({
          driver_nick_name: {
            [Op.like]: `%${filterData.split(" ")[i]}%`,
          },
        });
        searchedDrivers.push({
          driver_first_name: {
            [Op.like]: `%${filterData.split(" ")[i]}%`,
          },
        });
        searchedDrivers.push({
          driver_last_name: {
            [Op.like]: `%${filterData.split(" ")[i]}%`,
          },
        });
        searchedDrivers.push({
          driver_phone: {
            [Op.like]: `%${filterData.split(" ")[i]}%`,
          },
        });
      }
      driversWhere.push({
        [Op.or]: searchedDrivers,
      });

      this.dbModel
        .findAll({
          order: [["driver_first_name", "ASC"]],
          attributes: [
            "car_number",
            "resource_type",
            "line_description",
            "current_trip_name",
            "driver_nick_name",
            "driver_first_name",
            "driver_last_name",
            "driver_phone",
            "id",
            "company_id",
            "zone",
            "fixed_filter",
            "latitude",
            "longitude",
          ],
          limit: 10,
          where: driversWhere,
        })
        .then((foundDrivers) => {
          let _drivers = foundDrivers;
          _drivers.map((driver) => (driver.resource_type = "driver"));
          data.push(..._drivers);
          res.send(data);
        })

        .catch((err) => {
          res.createErrorLogAndSend({
            err: err.message || "Some error occurred while getting resources.",
          });
        });
    }
  };

  //Chosen chips in filter in client
  async getSelectedItems(req, res) {
    let filterData = req.query;

    let rules = [];
    // prepared where clause
    let zone = takeZones(req.user.zones);

    let _company_id = req.company_id;

    rules.push(zone);
    rules.push({ company_id: _company_id });

    // NB uncomment when is needed, to prevent slowing down work flow
    // {
    //   fixed_filter: {
    //     [Op.like]: `%${filterData.filters}%`,
    //   },
    // },

    if (filterData.drivers !== "") {
      let driversWhere = [];
      for (
        let i = 0;
        i < (filterData.drivers.match(/,/g) || []).length + 1;
        i++
      ) {
        driversWhere.push({
          id: {
            [Op.like]: `%${filterData.drivers.split(",")[i]}%`,
          },
        });

        // driversWhere.push({
        //   driver_nick_name: {
        //     [Op.like]: `%${filterData.drivers.split(",")[i]}%`,
        //   },
        // });
        // driversWhere.push({
        //   driver_first_name: {
        //     [Op.like]: `%${filterData.drivers.split(",")[i]}%`,
        //   },
        // });
        // driversWhere.push({
        //   driver_last_name: {
        //     [Op.like]: `%${filterData.drivers.split(",")[i]}%`,
        //   },
        // });
      }
      rules.push({
        [Op.or]: driversWhere,
      });
    }
    // loop in cars
    if (filterData.cars !== "") {
      let carsWhere = [];
      for (let i = 0; i < (filterData.cars.match(/,/g) || []).length + 1; i++) {
        carsWhere.push({
          car_number: {
            [Op.like]: `%${filterData.cars.split(",")[i]}%`,
          },
        });
      }
      rules.push({
        [Op.or]: carsWhere,
      });
    }
    // loop in text
    if (filterData.text !== "") {
      let textWhere = [];
      for (let i = 0; i < (filterData.text.match(/,/g) || []).length + 1; i++) {
        textWhere.push({
          line_description: {
            [Op.like]: `%${filterData.text.split(",")[i]}%`,
          },
        });
        textWhere.push({
          resource_type: {
            [Op.like]: `%${filterData.text.split(",")[i]}%`,
          },
        });
        textWhere.push({
          driver_first_name: {
            [Op.like]: `%${filterData.text.split(",")[i]}%`,
          },
        });
        textWhere.push({
          driver_last_name: {
            [Op.like]: `%${filterData.text.split(",")[i]}%`,
          },
        });
        textWhere.push({
          driver_nick_name: {
            [Op.like]: `%${filterData.text.split(",")[i]}%`,
          },
        });
        textWhere.push({
          car_number: {
            [Op.like]: `%${filterData.text.split(",")[i]}%`,
          },
        });
      }
      rules.push({
        [Op.or]: textWhere,
      });
    }

    let r = await this.dbModel
      .findAll({
        attributes: [
          "resource_type",
          "line_description",
          "car_number",
          "driver_nick_name",
          "driver_first_name",
          "driver_last_name",
          "driver_phone",
          "id",
          "company_id",
          "fixed_filter",
          "latitude",
          "longitude",
        ],
        where: rules,
      })
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.createErrorLogAndSend({
          message:
            err.message ||
            "Some error occurred while getting selected resources.",
        });
      });
  }
}

export default FilterController;
