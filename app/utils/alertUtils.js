const { QueryTypes } = require("sequelize");
const MINS_BACK_INTERVAL_OVERLAPPING = 15;
const MINS_AFTER_INTERVAL_OVERLAPPING = 15;

exports.updateAlertsFunction = async function (sequelize, req, res) {
    try {
        await sequelize.query(`UPDATE planning SET alerts = '';`);
        let overlapping = [];

        const planning = await sequelize.query(`SELECT * FROM planning`, { type: QueryTypes.SELECT });
        for (let i = 0; i < planning.length; i++) {
            let alertUpdated = false;

            if (planning[i].order_id && planning[i].order_id > 0) {
                const order = await sequelize.query(`SELECT * FROM orders WHERE id = ${planning[i].order_id}`, { type: QueryTypes.SELECT });
                const types = await sequelize.query(`SELECT * FROM types WHERE id = ${order[0].type_id} and name = 'חינוך מיוחד' `, { type: QueryTypes.SELECT });
                if (types && types.length > 0) {
                    if (planning[i].alerts && planning[i].alerts.length > 0) {
                        const update = await sequelize.query(`UPDATE planning AS p SET alerts = ',noChaperone' WHERE id = ${planning[i].id};`);
                    } else {
                        const update = await sequelize.query(`UPDATE planning AS p SET alerts = 'noChaperone' WHERE id = ${planning[i].id};`);
                    }
                    alertUpdated = true;
                }
            }

            if (planning[i].resource_bank_id) {
                let rb = await sequelize.query(`SELECT * from resource_bank WHERE id = ${planning[i].resource_bank_id}`, { type: QueryTypes.SELECT });
                if (rb && rb[0]) {
                    if (!(rb[0].driver_id && rb[0].driver_id > 0 && rb[0].driver_id != undefined)) {
                        if (alertUpdated) {
                            const update = await sequelize.query(`UPDATE planning AS p SET alerts = CONCAT(p.alerts, ',noDriver') WHERE id = ${planning[i].id};`);
                        } else {
                            const update = await sequelize.query(`UPDATE planning AS p SET alerts = 'noDriver' WHERE id = ${planning[i].id};`);
                        }
                        alertUpdated = true;
                    }
                    if (!(rb[0].vehicle_id && rb[0].vehicle_id > 0 && rb[0].vehicle_id != undefined)) {
                        if (alertUpdated) {
                            const update = await sequelize.query(`UPDATE planning AS p SET alerts = CONCAT(p.alerts, ',noCar') WHERE id = ${planning[i].id};`);
                        } else {
                            const update = await sequelize.query(`UPDATE planning AS p SET alerts = 'noCar' WHERE id = ${planning[i].id};`);
                        }
                        alertUpdated = true;
                    }
                }
            }

            const orders = await sequelize.query(`SELECT * FROM orders WHERE id = ${planning[i].order_id} ORDER BY start ASC;`, { type: QueryTypes.SELECT });
            const rb = await sequelize.query(`SELECT * FROM resource_bank WHERE id = ${planning[i].resource_bank_id};`, { type: QueryTypes.SELECT });
            overlapping.push({
                order_id: orders && orders[0] && orders[0].id ? orders[0].id : 0,
                overlapingVehicles: rb && rb[0] && rb[0].vehicle_id ? rb[0].vehicle_id : 0,
                overlapingDrivers: rb && rb[0] && rb[0].driver_id ? rb[0].driver_id : 0,
                startTime: orders && orders[0] && orders[0].start ? orders[0].start : 0,
                endTime: orders && orders[0] && orders[0].end ? orders[0].end : 0,
                planning_id: planning[i].id,
                alertsExisting: (planning[i].alerts && planning[i].alerts.length > 0) || alertUpdated,
            })
        } // for

        for (let k = 0; k < overlapping.length; k++) {
            if (overlapping[k].overlapingDrivers && overlapping[k].overlapingDrivers > 0 && overlapping[k].overlapingVehicles && overlapping[k].overlapingVehicles > 0
                && overlapping[k - 1] && overlapping[k - 1].startTime &&
                overlapping[k] && overlapping[k].startTime &&
                overlapping[k + 1] && overlapping[k + 1].startTime &&
                overlapping[k - 1] && overlapping[k - 1].endTime &&
                overlapping[k] && overlapping[k].endTime &&
                overlapping[k + 1] && overlapping[k + 1].endTime
            ) {
                if (
                    new Date(overlapping[k].startTime).getTime() - new Date(overlapping[k - 1].startTime).getTime() < MINS_BACK_INTERVAL_OVERLAPPING * 60000 ||
                    new Date(overlapping[k].endTime).getTime() - new Date(overlapping[k - 1].endTime).getTime() < MINS_AFTER_INTERVAL_OVERLAPPING * 60000 ||
                    new Date(overlapping[k + 1].startTime).getTime() - new Date(overlapping[k].startTime).getTime() < MINS_BACK_INTERVAL_OVERLAPPING * 60000 ||
                    new Date(overlapping[k + 1].endTime).getTime() - new Date(overlapping[k].endTime).getTime() < MINS_AFTER_INTERVAL_OVERLAPPING * 60000
                ) {
                    if (overlapping[k].alertsExisting) {
                        const update = await sequelize.query(`UPDATE planning AS p SET alerts = CONCAT(p.alerts, ',overlappingTrip') WHERE id = ${planning[k].id};`);
                    } else {
                        const update = await sequelize.query(`UPDATE planning SET alerts = 'overlappingTrip' WHERE id = ${planning[k].id};`);
                    }

                }
            }
        }

        return res ? res.status(200).send({ done: '1' }) : { done: '1' };
    } catch (e) {
        return res ?
            res.status(500).send({
                message: e.message || "Some error occurred while getting driver widget.",
            }) :
            {
                message: e.message || "Some error occurred while getting driver widget.",
            };
    }
};