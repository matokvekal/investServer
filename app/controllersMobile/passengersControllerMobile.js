import res from "express/lib/response";
import BaseControllerMobile from "./baseControllerMobile";
// const { QueryTypes } = require("sequelize");
class PassengersControllerMobile extends BaseControllerMobile {
  // constructor(app, modelName, sequelize) {
  //   super(app, modelName, sequelize);
  // }

  getPassengersForOrder = async (req, res) => {
    try {
      //  let driverPhone = req.user.user_name;
      let stationForOrderId = req.query.stationForOrderId;
      let orderId = req.query.order_id;
      if (!stationForOrderId) {
        // return res.status(500).send({
        //   message: "Some error occurred when try to get passengersForOrders.",
        // });
        return await res.createErrorLogAndSend({ err: "Some error occurred when try to get passengersForOrders." });

      }
      let response = await this.sequelize.query(
        `SELECT * FROM passengers_for_order WHERE station_for_order_id = ${stationForOrderId} and order_id = ${orderId}`,
        { type: QueryTypes.SELECT }
      );
      return res.send(response);
    } catch (e) {
      return await res.createErrorLogAndSend({ err: e.message || "Some error occurred while getting passengers for order." });
    }
  };

  // put /
  updateBoarding = async (req, res) => {
    try {
      let response;
      const { station_for_order_id, action, order_id, id } = req.query;
      if (order_id && station_for_order_id && action && id) {
        // console.log(
        //   `UPDATE passengers_for_order SET  ${action},_time = NOW(),${action}=1 WHERE station_for_order_id = ${station_for_order_id} and order_id=${order_id})`
        // );
        if (action === "on_board") {
          //console.log(`UPDATE passengers_for_order SET  on_board_time = NOW(),on_board=1 WHERE station_for_order_id = ${station_for_order_id} and order_id=${order_id} and id =${id}`)
          response = await this.sequelize.query(
            `UPDATE passengers_for_order SET  on_board_time = NOW(),on_board=1 WHERE station_for_order_id = ${station_for_order_id} and order_id=${order_id} and id =${id}`
          );
        }
        if (action === "off_board") {
          response = await this.sequelize.query(
            `UPDATE passengers_for_order SET  off_board_time = NOW(),off_board=1 WHERE station_for_order_id = ${station_for_order_id} and order_id=${order_id} and id=${id}`
          );
        }
        return res.send("OK");
      }
      // return res.status(500).send({
      //   message: "Error at update passenger boarding.",
      // });
      return await res.createErrorLogAndSend({ err: "Error at update passenger boarding." });
    } catch (e) {
      // return res.status(500).send({
      //   message: e.message || "Error at update passenger boarding.",
      // });
      return await res.createErrorLogAndSend({ err: e.message || "Error at update passenger boarding." });
    }
  };

  // getStationsForOrder = async (req, res) => {
  //   try {
  //     let driverPhone = req.user.user_name;
  //     let orderId = req.query.orderId;
  //     if (!orderId && !driverPhone) {
  //       return res.status(500).send({
  //         message:
  //           "Some error occurred while moving passengers for order - driverPhone and order_id: required.",
  //       });
  //     }
  //     let response = await this.sequelize.query(
  //       `SELECT * FROM station_for_order_for_driver WHERE driver_phone_number = "${driverPhone}" and  order_id ="${orderId}" `
  //     );
  //     return res.send(response);
  //   } catch (e) {
  //     return res.status(500).send({
  //       message:
  //         e.message || "Some error occurred while getting station for order.",
  //     });
  //   }
  // };
}

export default PassengersControllerMobile;
