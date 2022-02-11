import { response } from "express";
import BaseControllerMobile from "./baseControllerMobile";

class UserControllerMobile extends BaseControllerMobile {
  // GET /users
  getUser(req, res) {
    this.dbModel
      .findAll({
        attributes: [
          "user_name",
          "user_role",
          "zones",
          "first_name",
          "last_name",
        ],
      })
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        // res.status(500).send({
        //   message: err.message || "Some error occurred while getting user.",
        // });
        res.createErrorLogAndSend({ err: err.message || "Some error occurred while getting user." });
      });
  }

}
export default UserControllerMobile;
