import res from "express/lib/response";
import { now } from "moment";
import BaseControllerMobile from "./baseControllerMobile";
const { QueryTypes } = require("sequelize");
class StationsControllerMobile extends BaseControllerMobile {
  constructor(app, modelName, sequelize) {
    super(app, modelName, sequelize);
  }

  // put /
  // updateStationLocation = async (req, res) => {
  //   try {
  //     let response;
  //     const { id, orderId, lat, long } = req.query;
  //     if (orderId && id && lat && long) {
  //       //  console.log( `UPDATE stations_for_order SET  lat='${lat}' ,long='${long}' WHERE id = ${id} and order_id=${orderId}`)
  //       response = await this.sequelize.query(
  //         `UPDATE stations_for_order s SET  s.driver_lat_reported=${lat} ,s.driver_long_reported=${long},arrived_at=now(),driver_at_station=1  WHERE s.id = ${id} and s.order_id=${orderId}`
  //       );
  //       return res.send("OK");
  //     }
  //     // return res.status(500).send({
  //     //   message: "Error ar update updateStationLocation boarding.",
  //     // });
  //     return await res.createErrorLogAndSend({
  //       err: "Error ar update updateStationLocation boarding.",
  //     });
  //   } catch (e) {
  //     // return res.status(500).send({
  //     //   message: e.message || "Error ar update updateStationLocation boarding.",
  //     // });
  //     return await res.createErrorLogAndSend({
  //       err: e.message || "Error ar update updateStationLocation boarding.",
  //     });
  //   }
  // };
  // post /
  updateArriveToStation = async (req, res) => {
    try {
      let response;
<<<<<<< HEAD
      const { id, orderId, arrivedAt, lat, long } = req.body;
      if (orderId && id) {
        let sql = "UPDATE stations_for_order s SET  s.driver_at_station=1 ";
        if (lat && long) {
          sql = sql +
            `,s.driver_lat_reported=${lat} ,s.driver_long_reported=${long}`;
        }
        if (arrivedAt && arrivedAt !== "") {
          sql = sql + `,s.arrived_at=now()`;
        }
        sql = sql + `WHERE s.id = ${id} and s.order_id=${orderId} `;
        console.log(sql);
        response = await this.sequelize.query(sql);
=======
      const { id, orderId, arrivedAt , lat , long } = req.body;
      if (orderId && id && arrivedAt && lat && long) {
        // console.log( `UPDATE stations_for_order s SET  s.Arrived_at='${arrivedAt}'   WHERE s.id = ${id} and s.order_id=${orderId}`)
        response = await this.sequelize.query(`UPDATE stations_for_order s SET  s.arrived_at='${arrivedAt}',driver_at_station=1, s.driver_lat_reported=${lat} ,s.driver_long_reported=${long}  WHERE s.id = ${id} and s.order_id=${orderId} `);
>>>>>>> 0a3cda3b9929f441a8acb0553e0f6d6611cd91a3
        return res.send("OK");
      }
      return await res.createErrorLogAndSend({
        err: "Error ar update updateArriveToStation .",
      });
    } catch (e) {
      return await res.createErrorLogAndSend({
        err: e.message || "Error ar update updateArriveToStation .",
      });
    }
  };
}

export default StationsControllerMobile;
