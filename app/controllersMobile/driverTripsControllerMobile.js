import BaseControllerMobile from "./baseControllerMobile";
const { QueryTypes } = require("sequelize");
const formidable = require('formidable');
const fs = require('fs')
const mime = require('mime');
const mkdirp = require('mkdirp');
const mv = require('mv');
const alertUtils = require("../utils/alertUtils");

class DriverTripsControllerMobile extends BaseControllerMobile {
  constructor(app, modelName, sequelize) {
    super(app, modelName, sequelize);
  }
  driversModel = "drivers";

  getModels(model) {
    this._dbModel = this.app.get("dbModels")[model];
    return this._dbModel;
  }


  getTripEvents = async (req, res) => {
    let _company_id = req.company_id;
    let trip_id = req.query.trip_id;

    try {
      //  let driverPhone = req.user.user_name;
      if (!_company_id) {
        return await res.createErrorLogAndSend({ message: "company_id not passed." });
      }

      let whereTripId = '';
      if (trip_id) {
        whereTripId = `AND trip_id = ${trip_id}`;
      }

      let response = await this.sequelize.query(
        `SELECT * FROM trip_events WHERE company_id = ${_company_id} ${whereTripId}`,
        { type: QueryTypes.SELECT }
      );

      return res.send(response);

    } catch (e) {
      // return res.status(500).send({
      //   message:
      //     e.message || "Some error occurred while getting data.",
      // });
      return await res.createErrorLogAndSend({ message: e || "Some error occurred while getting data." });
    }
  };


  getCountCommonOrderNumber = async (req, res) => {
    let _company_id = req.company_id;
    let common_order_number = req.query.common_order_number;

    try {
      //  let driverPhone = req.user.user_name;
      if (!_company_id && !common_order_number) {
        return await res.createErrorLogAndSend({ message: "company_id or common_order_number not passed." });
      }

      let response = await this.sequelize.query(
        `SELECT count(id) as count_common_order_number FROM orders WHERE company_id = ${_company_id} AND common_order_number = '${common_order_number}'`,
        { type: QueryTypes.SELECT }
      );

      return res.send(response);

    } catch (e) {
      // return res.status(500).send({
      //   message:
      //     e.message || "Some error occurred while getting data.",
      // });
      return await res.createErrorLogAndSend({ message: e || "Some error occurred while getting data." });
    }

  }

  appendLeadingZeroes = (n) =>
    (parseInt(n) <= 9 ? "0" + n : n)

  uploadImageFunction = async (file, savePath, imgName = "") => {
    try {
      if (!file) {
        return { error: 'No file added' };
      }

      let allowedExtensions = ['gif', 'jpeg', 'jpg', 'png', 'svg', 'blob'];
      let fileData = "";

      if (parseInt(file.size) / 1000000 > 3) {
        return { error: 'Image can be less than 3MB' };
      }

      var d = new Date();

      if (imgName && file.originalFilename) {
        let parts = file.originalFilename.split(".");
        // imgName = file.md5 ? file.md5 : parts[0];
        let ext = mime.getExtension(file.mimetype); //parts[parts.length-1];

        if (!allowedExtensions.includes(ext)) {
          return { error: ext + " is not allowed extension" }
        }

        imgName += "." + ext;
      } else { //if imgName not given -> generate a random one
        let ext = mime.getExtension(file.mimetype); //parts[parts.length-1];
        if (!allowedExtensions.includes(ext)) {
          return { error: ext + " is not allowed extension" }
        }
        let fileName = file.originalFilename ? (file.originalFilename.slice(0, -(ext.length + 1))).replace(/\s+/g, '') : "";
        imgName = fileName + "_" + d.getTime() + "." + ext;
      }

      fileData = file.data;

      savePath = process.cwd() + '' + savePath;
      let imgPath = savePath + '\\' + imgName;

      // let made = await mkdirp(savePath);//.then(async made => {
      // if (made) return { error: made };

      await mv(file.filepath, imgPath, { mkdirp: true }, function (err) {
        if (err) return { error: err }
      });

      return { success: true, payload: { "imgName": imgName } };

    } catch (e) {
      return { error: e };
    }

  }

  addImage = async (req, res) => {

  }

  addData = async (req, res) => {
    const self = this;
    let insertSql, insertedTripEvent;

    var form = new formidable.IncomingForm({ multiples: true });
    form.parse(req, async function (err, fields, files) {
      let imagePassed = true;

      if (files && files.file) {
        // It is moved down, because of the inserted id
      } else {
        imagePassed = false;
      }

      if (fields && Object.values(fields).length > 0) {
        let columnsSql = [];
        let dataSql = [];

        for (let k = 0; k < Object.values(fields).length; k++) {
          if (Object.keys(fields)[k] != 'images' && Object.keys(fields)[k] != 'file') { // You cant update images column, they are auto updated
            columnsSql.push(Object.keys(fields)[k]);
            dataSql.push("'" + Object.values(fields)[k] + "'");
          }
        }

        insertSql = 'INSERT INTO trip_events (`' + columnsSql.join("`,`") + '`) VALUES (' + dataSql.join() + ')';

        try {
          if (insertSql) {
            insertedTripEvent = await self.sequelize.query(insertSql, { type: self.sequelize.QueryTypes.INSERT });

            if (!insertedTripEvent) {
              return res.createErrorLogAndSend({
                message:
                  "Some error occurred while inserting trip events. Images are not added too.",
              });
            }

            if (imagePassed) {

              let id = insertedTripEvent[0];
              if (!id) {
                return res.createErrorLogAndSend({ message: 'Insertion data problem. Images are not added too.' });
              }

              let getImagesCount = await self.sequelize.query(`SELECT images FROM trip_events WHERE id = '${id}';`, { type: QueryTypes.SELECT });
              let hasImage = getImagesCount[0].images.length > 0;
              let countImages = ((getImagesCount[0].images).match(/,/g) || []).length;
              if (hasImage) {
                countImages++;
              }

              if (countImages > 10) {
                let response = await self.sequelize.query(`DELETE FROM trip_events WHERE id = '${id}';`);
                return res.createErrorLogAndSend({ message: 'Maximum images reached. Data was not added too.' });
              }

              let loopTimes = Array.isArray(files.file) ? Object.values(files.file).length : 1;
              let responsesSuccess = [];
              let responsesError = [];

              for (let i = 0; i < loopTimes; ++i) {
                let fileToUse = Array.isArray(files.file) ? files.file[i] : files.file;

                if (!req.body.category_id && !fileToUse) {
                  console.log(`No images to upload`)
                  // return res.createErrorLogAndSend({ message: 'No images to upload' });
                }

                if (loopTimes >= 10) {
                  let response = await self.sequelize.query(`DELETE FROM trip_events WHERE id = '${id}';`);
                  return res.createErrorLogAndSend({ message: 'Maximum images reached. Data was not added too.' });
                }

                let now = new Date();
                let nowInt = self.appendLeadingZeroes(now.getDate()) + '' + self.appendLeadingZeroes((parseInt(now.getMonth()) + 1)) + '' + now.getFullYear() + '' + self.appendLeadingZeroes(now.getHours()) + '' + self.appendLeadingZeroes(now.getMinutes()) + '' + self.appendLeadingZeroes(now.getSeconds()) + self.appendLeadingZeroes(now.getMilliseconds());
                let imgPath = id + '_' + nowInt + '_' + (countImages + i + 1);

                let imgResp = await self.uploadImageFunction(fileToUse, '/imagesTripEvent', imgPath);

                if (imgResp && imgResp.success) {
                  let imgName = imgResp.payload.imgName;
                  let updateImageName = (hasImage || i > 0) ? (',' + imgName) : imgName;
                  let response = await self.sequelize.query(`UPDATE trip_events as te SET te.images = CONCAT(te.images, '${updateImageName}') WHERE id = '${id}';`);
                  responsesSuccess.push(response);
                } else {
                  responsesError.push({ message: imgResp.error });
                  // res.createErrorLogAndSend({ message: imgResp.error })
                }
              }

              if (responsesError && Object.values(responsesError).length > 0) {
                let response = await self.sequelize.query(`DELETE FROM trip_events WHERE id = '${id}';`);
                return res.createErrorLogAndSend({
                  message: responsesError,
                });
              }

            } else {
              console.log(`No image passed only`);
            }

            return res.json(imagePassed ? 'Data & Image Added' : 'Data Added');
          }
        } catch (e) {
          return res.createErrorLogAndSend({
            message:
              "Some error occurred while inserting trip events. Images are not added too!",
          });
        }

      } else {
        return res.createErrorLogAndSend({ message: 'No data fields passed!' })
      }

    });

    // const data = req.body.data;
    // let _company_id = req.company_id;

    // if (!data || Object.values(data).length == 0) {
    //   return res.createErrorLogAndSend({
    //     message: "Some error occurred while adding passenger for order - data: required."
    //   });
    // }

    // let columnsSql = [];
    // for (let i = 0; i < Object.values(data).length; i++) {
    //   columnsSql.push(Object.keys(data)[i]);
    // }

    // let dataSql = [];
    // for (let i = 0; i < Object.values(data).length; i++) {
    //   dataSql.push("'" + Object.values(data)[i] + "'");
    // }

    // if (columnsSql.indexOf('company_id') == -1) {
    //   columnsSql.push('company_id');
    //   dataSql.push("'" + _company_id + "'");
    // }

    // let insertSql = 'INSERT INTO trip_events (`' + columnsSql.join("`,`") + '`) VALUES (' + dataSql.join() + ')';

    // const response = this.sequelize.query(insertSql);

    // response
    //   .then(d =>
    //     res.status(200).send(d)
    //   )
    //   .catch((err) => {
    //     return res.createErrorLogAndSend({
    //       err:
    //         "Some error occurred while inserting driver trips",
    //     });
    //   });


  }

  getDriverTrips = (req, res) => {
    try {
      this.getModels(this.driversModel)
        .findAll({
          attributes: ["id", "phone_number", "company_id"],
          where: {
            phone_number: req.user.user_name,
          },
        })
        .then(async (data) => {
          const _driverTrips = await this.getDataFromView(data);
          res.json(_driverTrips);
        })
        .catch((err) => {
          // console.log("Some error occurred while getting user !", err);
          // res.status(200).send({
          //   message: err.message || err,
          // });
          res.createErrorLogAndSend({ err, status: 200 });
        });
    }
    catch (e) {
      // return res.status(500).send({
      //   message: e.message || "Some error occurred while getting driver trips.",
      // });
      return res.createErrorLogAndSend({ err: e.message || "Some error occurred while getting driver trips." });
    }
  };

  getDataFromView = async (drivers) => {
    try {
      if (drivers.length > 0) {
        const driver_ids = [];
        drivers.map((driver) => driver_ids.push(driver.id));
        return await this.sequelize.query(
          "SELECT * FROM v_drivers_trip_data WHERE driver_id IN (  " +
          driver_ids.join() +
          "  ) ",
          { type: QueryTypes.SELECT }
        );
      } else {
        return await res.createErrorLogAndSend({ err: "There are no trips for current driver" });
      }
    } catch (e) {
      // return res.status(500).send({
      //   message: e.message || "Some error occurred while getting driver trip_data.",
      // });
      return await res.createErrorLogAndSend({ err: e.message || "Some error occurred while getting driver trip_data." });
    }
  };


  approvePlanning = async (req, res) => {
    let resp = {};
    try {
      const { planningId, approved } = req.body;
      if (planningId && approved) {
        resp = await this.sequelize.query(`UPDATE planning SET driver_approve = ${approved}, approved_date = NOW() WHERE id = ${planningId}`);
        await alertUtils.updateAlertsFunction(this.sequelize);
        return res.send(resp);
      }
      // return res.status(500).send({
      //   message: "You have to pass approved value and planningId, so driver can't be approved right now!",
      // });
      return await res.createErrorLogAndSend({ err: "You have to pass approved value and planningId, so driver can't be approved right now!" });
    } catch (e) {
      // return res.status(500).send({
      //   message: e.message || "Some error occurred while getting driver widget.",
      // });
      return await res.createErrorLogAndSend({ err: e.message || "Some error occurred while getting driver widget." });
    }
  }

  statusPlanning = async (req, res) => {
    let resp = {};
    try {
      const { planningId, status } = req.body;
      if (planningId && status) {
        resp = await this.sequelize.query(`UPDATE planning SET status = ${status}, last_updated = NOW() WHERE id = ${planningId}`);
        await alertUtils.updateAlertsFunction(this.sequelize);
        return res.send(resp);
      }
      // return res.status(500).send({
      //   message: "You have to pass status value and planningId, so driver can't be updated right now!",
      // });
      return await res.createErrorLogAndSend({ err: "You have to pass status value and planningId, so driver can't be updated right now!" });
    } catch (e) {
      // return res.status(500).send({
      //   message: e.message || "Some error occurred while getting driver widget.",
      // });
      return await res.createErrorLogAndSend({ err: e.message || "Some error occurred while getting driver widget." });
    }
  }

}

export default DriverTripsControllerMobile;
