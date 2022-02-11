import BaseControllerPlanner from "./baseControllerPlanner";
const { QueryTypes } = require("sequelize");
const alertUtils = require("../utils/alertUtils");
const CONFIG = require("../config/config.json");

class PlanningControllerPlanner extends BaseControllerPlanner {
    constructor(app, modelName, sequelize) {
        super(app, modelName, sequelize);
    }

    resetPublishPlanning = async (req, res) => {
        let _company_id = req.company_id;
        let { planning_ids } = req.body;
        planning_ids = JSON.parse(planning_ids); // Needed, making it into array

        if (planning_ids && planning_ids.length > 0 && Array.isArray(planning_ids)) {
            let resp = await this.sequelize.query(`UPDATE planning 
            SET driver_approve = 0, 
            is_published_to_customers = 0, 
            is_published_to_client = 0, 
            is_published_to_driver = 0, 
            is_driver_recived = 0, 
            is_publish_to_chaperone = 0, 
            is_chaperone_approved = 0
            WHERE id IN (${planning_ids.join()})`);
            return res.send(resp);
        } else {
            return await res.createErrorLogAndSend({ message: "You have to pass planning_ids array of ids!" });
        }
    }

    makeAPublish = async (planning_ids, planningsIdsFromChaperones, _company_id) => {
        let resp = [];

        for (let i = 0; i < planning_ids.length; i++) {
            let planning_id = planning_ids[i];
            let updatePlanningColumn;
            let getMessageTitle = await this.sequelize.query(`call get_data_from_dictionary('${CONFIG.currentLanguage}','driver_notification_title',${_company_id})`, { type: QueryTypes.SELECT });
            if (getMessageTitle && getMessageTitle[0] && getMessageTitle[0][0] && getMessageTitle[0][0].value) {
                getMessageTitle = getMessageTitle[0][0].value;
            } else {
                getMessageTitle = '';
            }

            let getMessageBody = await this.sequelize.query(`call get_data_from_dictionary('${CONFIG.currentLanguage}','driver_notification_message',${_company_id})`, { type: QueryTypes.SELECT });
            if (getMessageBody && getMessageBody[0] && getMessageBody[0][0] && getMessageBody[0][0].value) {
                getMessageBody = getMessageBody[0][0].value;
            } else {
                getMessageBody = '';
            }

            let vPlanningResp = await this.sequelize.query(`SELECT * FROM v_planning WHERE planning_id = ${planning_id}`, { type: QueryTypes.SELECT });

            let driverPhoneNumber, chaperonePhoneNumber;
            if (planningsIdsFromChaperones.includes(planning_id)) {
                if (vPlanningResp && vPlanningResp[0] && vPlanningResp[0].planning_chaperone_id) {
                    let chaperoneId = vPlanningResp[0].planning_chaperone_id;
                    chaperonePhoneNumber = await this.sequelize.query(`SELECT * FROM chaperones WHERE id = ${chaperoneId}`, { type: QueryTypes.SELECT });

                    if (chaperonePhoneNumber && chaperonePhoneNumber[0] && chaperonePhoneNumber[0].phone_number) {
                        chaperonePhoneNumber = chaperonePhoneNumber[0].phone_number;
                        updatePlanningColumn = ' `is_publish_to_chaperone` = 1 ';
                    }
                }
            } else {
                if (vPlanningResp && vPlanningResp[0] && vPlanningResp[0].driver_phone_number) {
                    driverPhoneNumber = vPlanningResp[0].driver_phone_number;
                }
            }
            let phoneNumber = driverPhoneNumber || chaperonePhoneNumber;

            let fireBaseToken = '';
            if (planningsIdsFromChaperones.includes(planning_id)) {
                fireBaseToken = '';
                // Here logic will be added soon for firebase token in a chaperone
            } else {
                if (vPlanningResp && vPlanningResp[0] && vPlanningResp[0].driver_id) {
                    let drivers = await this.sequelize.query(`SELECT * FROM drivers WHERE id = ${vPlanningResp[0].driver_id}`, { type: QueryTypes.SELECT });
                    if (drivers && drivers[0] && drivers[0].fire_base_token) {
                        fireBaseToken = drivers[0].fire_base_token;
                    }
                }
            }

            resp.push(await this.sequelize.query("INSERT INTO mobile_notifications (`phone_number`,`fire_base_token`,`message_title`,`message_body`,`planning_id`) VALUES ('" + phoneNumber + "', '" + fireBaseToken + "', '" + getMessageTitle + "', '" + getMessageBody + "', '" + planning_id + "')"));
            if (!updatePlanningColumn) {
                updatePlanningColumn = ' `is_published_to_driver` = 1 ';
            }

            await this.sequelize.query("UPDATE planning SET `has_publish` = 1, " + updatePlanningColumn + " WHERE id = " + planning_id);
        }

        return resp;

    }

    publishPlanning = async (req, res) => {
        let _company_id = req.company_id;
        let { planning_ids } = req.body;

        planning_ids = JSON.parse(planning_ids); // Needed, making it into array

        if (planning_ids && planning_ids.length > 0 && Array.isArray(planning_ids)) {

            let planningsNotPublishedToDriversIds = [];
            let planningsToPublishIds = [];
            let planningsNotPublishedToDrivers = await this.sequelize.query(`SELECT * FROM planning WHERE is_published_to_driver = 0 AND chapeeron_id IS NULL AND id IN(${planning_ids.join()})`, { type: QueryTypes.SELECT });
            for (let i = 0; i < planningsNotPublishedToDrivers.length; i++) {
                let order = await this.sequelize.query(`SELECT o.* FROM orders as o WHERE o.end >= NOW() AND o.id = ${planningsNotPublishedToDrivers[i].order_id}`, { type: QueryTypes.SELECT });
                if (order && Array.isArray(order) && order.length > 0) {
                    planningsNotPublishedToDriversIds.push(planningsNotPublishedToDrivers[i].id);
                    planningsToPublishIds.push(planningsNotPublishedToDrivers[i].id);
                }
            }

            let planningsIdsFromChaperones = [];
            let planningsNotPublishedToChaperone = await this.sequelize.query(`SELECT * FROM planning WHERE is_publish_to_chaperone = 0 AND chapeeron_id IS NOT NULL AND id IN(${planning_ids.join()})`, { type: QueryTypes.SELECT });
            for (let i = 0; i < planningsNotPublishedToChaperone.length; i++) {
                if (!planningsNotPublishedToDriversIds.includes(planningsNotPublishedToChaperone[i].id)) {
                    let order = await this.sequelize.query(`SELECT o.* FROM orders as o WHERE o.end >= NOW() AND o.id = ${planningsNotPublishedToChaperone[i].order_id}`, { type: QueryTypes.SELECT });
                    if (order && Array.isArray(order) && order.length > 0) {
                        planningsIdsFromChaperones.push(planningsNotPublishedToChaperone[i].id);
                        planningsToPublishIds.push(planningsNotPublishedToChaperone[i].id);
                    }
                }
            }
            return res.json(this.makeAPublish(planningsToPublishIds, planningsIdsFromChaperones, _company_id)); // Making the notification

        } else {
            return await res.createErrorLogAndSend({ message: "You have to pass planning_ids array of ids!" });
        }

    }

}


export default PlanningControllerPlanner;

