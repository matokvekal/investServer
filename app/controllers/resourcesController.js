import { takeZones } from "../utils/splitRequest";
import BaseController from "./baseController";
const { Op, where } = require("sequelize");

let attributes = require("../attributes");
const cron = require("node-cron");

// const dbs = require("../models");
// const Resources = dbs.Resources;

let resourcesService;

class ResourcesController extends BaseController {
  //  attributes=['id', 'resource_type','line_date']
  constructor(app, modelName) {
    super(app, modelName);

    resourcesService = require("../services/resourcesService")(this.dbModel);
  }

  // GET /resources
  getResources(req, res) {
    let resourcesData;
    let where = [];

    let _company_id = req.company_id;

    // prepared where clause
    let zone = takeZones(req.user.zones ? req.user.zones : "");


    where.push(zone);
    where.push({ company_id: _company_id });
    resourcesData = resourcesService.getAllResources(where);

    resourcesData
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        // res.status(500).send({
        //   message:
        //     err.message || "Some error occurred while getting resources.",
        // });
        res.createErrorLogAndSend({
          err: err.message || "Some error occurred while getting resources.",
        });
      });
  }

  // GET /resources/locations
  getResourceLocations(req, res) {
    let resourcesData;
    let where = [];

    let _company_id = req.company_id;

    // prepared where clause
    let zone = takeZones(req.user.zones ? req.user.zones : "");

    where.push(zone);
    where.push({ company_id: _company_id });
    resourcesData = resourcesService.getAllResources(where, [
      "company_id",
      "car_number",
      "latitude",
      "longitude",
      "position_last_update",
      "position_source",
      "position_user_update",
      "latitude_before",
      "longitude_before"
    ]);

    resourcesData
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        // res.status(500).send({
        //   message:
        //     err.message || "Some error occurred while getting resources.",
        // });
        res.createErrorLogAndSend({
          err: err.message || "Some error occurred while getting resources.",
        });
      });
  }

  // POST /resources/add
  addResource(req, res) {
    this.dbModel
      .create(req.body)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        // res.status(500).send({
        //   message:
        //     err.message || "Some error occurred while creating resources.",
        // });
        res.createErrorLogAndSend({
          err: err.message || "Some error occurred while creating resources.",
        });
      });
  }

  // POST /resources/add-bulk
  addBulkResources(req, res) {
    this.dbModel
      .bulkCreate(req.body)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        // res.status(500).send({
        //   message:
        //     err.message || "Some error occurred while bulk creating resources.",
        // });
        res.createErrorLogAndSend({
          err:
            err.message || "Some error occurred while bulk creating resources.",
        });
      });
  }

  // PUT request update resource with given prev and next station id
  updatePrevAndNextStationId(req, res) {
    this.dbModel
      .update(
        {
          prev_station_id: req.body.prev_station_id,
          next_station_id: req.body.next_station_id,
        },
        { where: { id: req.body.resource_id } }
      )
      .then((data) => {
        res.send({
          status: 200,
          message: "Successfully updated resource",
        });
      })
      .catch((err) => {
        // res.status(500).send({
        //   message:
        //     err.message || "Some error occurred while bulk creating resources.",
        // });
        res.createErrorLogAndSend({
          err:
            err.message || "Some error occurred while bulk creating resources.",
        });
      });
  }
}
export default ResourcesController;
