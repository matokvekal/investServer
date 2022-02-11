import BaseControllerPlanner from "./baseControllerPlanner";
const { QueryTypes } = require("sequelize");
const alertUtils = require("../utils/alertUtils");

class PlanningControllerPlanner extends BaseControllerPlanner {
	constructor(app, modelName, sequelize) {
		super(app, modelName, sequelize);
	}

	appendLeadingZeroes = (n) =>
		(parseInt(n) <= 9 ? "0" + n : n)

	updatePlanningAlert = async (req, res) => {
		let resp = {};
		try {
			const { planning_id, alerts } = req.body;
			if (planning_id && alerts) {
				resp = await this.sequelize.query(`UPDATE planning SET alerts = ${alerts}, last_updated = NOW() WHERE id = ${planning_id}`);
				// HERE DO NOT UPDATE ALERTS
				return res.send(resp);
			}
			// return res.status(500).send({
			//   message: "You have to pass status value and planning_id, so driver can't be updated right now!",
			// });
			return await res.createErrorLogAndSend({ message: "You have to pass alerts value and planning_id, so planning can't be updated right now!" });
		} catch (e) {
			// return res.status(500).send({
			//   message: e.message || "Some error occurred while getting driver widget.",
			// });
			return await res.createErrorLogAndSend({ message: e.message || "Some error occurred while getting driver widget." });
		}
	}

	updatePlanningOrderDriverVehicleAndTime = async (req, res) => {
		const orderId = req.body.order_id;
		const newStartTime = req.body.new_start_time;
		const newEndTime = req.body.new_end_time;
		const newDriverId = req.body.new_driver_id;
		const newVehicleId = req.body.new_vehicle_id;
		let resp;

		if (!orderId) {
			return await res.createErrorLogAndSend({ message: "Order id not found" });
		}

		if (newDriverId) {
			let planning = await this.sequelize.query(`SELECT * FROM planning WHERE order_id = ${orderId}`, { type: QueryTypes.SELECT });
			let rbId = planning && planning[0] && planning[0].resource_bank_id ? planning[0].resource_bank_id : 0

			if (rbId) {
				resp = await this.sequelize.query(`UPDATE resource_bank SET driver_id ='${newDriverId}' WHERE id = ${rbId};`);
				return res.send(resp);
			} else {
				return await res.createErrorLogAndSend({ message: "Resource bank not found" });
			}

		} else if (newVehicleId) {
			let planning = await this.sequelize.query(`SELECT * FROM planning WHERE order_id = ${orderId}`, { type: QueryTypes.SELECT });
			let rbId = planning && planning[0] && planning[0].resource_bank_id ? planning[0].resource_bank_id : 0

			if (rbId) {
				resp = await this.sequelize.query(`UPDATE resource_bank SET vehicle_id ='${newVehicleId}' WHERE id = ${rbId};`);
				return res.send(resp);
			} else {
				return await res.createErrorLogAndSend({ message: "Resource bank not found" });
			}
		} else if (newStartTime && newEndTime) {
			resp = await this.sequelize.query(`UPDATE orders SET start = '${newStartTime}', end = '${newEndTime}' WHERE id = ${orderId};`);
			return res.send(resp);
		} else {
			return await res.createErrorLogAndSend({ message: "You should pass new_driver_id or new_vehicle_id or (new_start_time and new_end_time)" });
		}

	}


	getDriversPlanningWIthStations = async (req, res) => {
		let planning = await this.sequelize.query(`SELECT * FROM v_drivers_trip_data`, { type: QueryTypes.SELECT });
		for (let i = 0; i < planning.length; i++) {
			if (planning[i].order_id && planning[i].order_id > 0) {
				let stationsForOrder = await this.sequelize.query(`SELECT * FROM stations_for_order WHERE order_id = ${planning[i].order_id}`, { type: QueryTypes.SELECT });
				if (stationsForOrder && stationsForOrder.length > 0) {
					planning[i].stations_for_order = [];
					for (let k = 0; k < stationsForOrder.length; k++) {
						planning[i].stations_for_order.push({
							lat: stationsForOrder[k].lat,
							long: stationsForOrder[k].long,
							time_to_arrive: stationsForOrder[k].time_to_arrive,
							time_to_live: stationsForOrder[k].time_to_live,
							arrived_at: stationsForOrder[k].arrived_at,
						})
					}
				}
			}
		}
		return res.send(planning);
	}

	updateOrderTimeAndStationsTime = async (req, res) => {
		const orderId = req.body.order_id;
		const newStartTime = req.body.new_start_time;
		const newEndTime = req.body.new_end_time;

		if (!orderId) {
			return await res.createErrorLogAndSend({ message: "Order id not found" });
		}

		// newStartTime
		if (newStartTime && newEndTime) {
			let oldOrder = await this.sequelize.query(`SELECT * FROM orders WHERE id = ${orderId};`, { type: QueryTypes.SELECT });

			let oldOrderStartTime = oldOrder[0].start;
			let differenceInTimes = (new Date(newStartTime).getTime()) - (new Date(oldOrderStartTime).getTime());

			let resp = await this.sequelize.query(`UPDATE orders SET start = '${newStartTime}', end = '${newEndTime}' WHERE id = ${orderId};`);

			let stationsForOrder = await this.sequelize.query(`SELECT * FROM stations_for_order WHERE order_id = ${orderId};`, { type: QueryTypes.SELECT });
			if (stationsForOrder && stationsForOrder.length > 0) {
				for (let i = 0; i < stationsForOrder.length; i++) {
					let currStationForOrderDate = stationsForOrder[i].time_to_arrive;
					let newTimeCurrStationForOrder = new Date(currStationForOrderDate).getTime() + differenceInTimes;

					newTimeCurrStationForOrder = new Date(newTimeCurrStationForOrder).getFullYear() + '-' +
						this.appendLeadingZeroes((parseInt(new Date(newTimeCurrStationForOrder).getMonth()) + 1)) + '-' +
						this.appendLeadingZeroes(new Date(newTimeCurrStationForOrder).getDate()) + ' ' +
						this.appendLeadingZeroes(new Date(newTimeCurrStationForOrder).getHours()) + ':' +
						this.appendLeadingZeroes(new Date(newTimeCurrStationForOrder).getMinutes()) + ':' +
						this.appendLeadingZeroes(new Date(newTimeCurrStationForOrder).getSeconds())

					let resp = await this.sequelize.query(`UPDATE stations_for_order SET time_to_arrive = '${newTimeCurrStationForOrder}' WHERE id = ${stationsForOrder[i].id}`);
				}
			}
			return res.send(resp);
			// newEndTime
		} else {
			return await res.createErrorLogAndSend({ message: "You should pass new_start_time and new_end_time" });
		}

	}

	removePlanningById = async (req, res) => {
		const planning_id = req.query.planning_id;

		if (planning_id) {
			let resp = await this.sequelize.query(`DELETE FROM planning WHERE id = ${planning_id};`);
			return res.send(resp);
		} else {
			return await res.createErrorLogAndSend({ message: "You should pass planning_id" });
		}
	}


	addPlanning = async (req, res) => {
		const data = req.body.data;
		let _company_id = req.company_id;

		if (!data || Object.values(data).length == 0) {
			return res.createErrorLogAndSend({
				message: "Some error occurred while adding passenger for order - data: required."
			});
		}

		let columnsSql = [];
		for (let i = 0; i < Object.values(data).length; i++) {
			columnsSql.push(Object.keys(data)[i]);
		}

		let dataSql = [];
		for (let i = 0; i < Object.values(data).length; i++) {
			dataSql.push("'" + Object.values(data)[i] + "'");
		}

		if (columnsSql.indexOf('company_id') == -1) {
			columnsSql.push('company_id');
			dataSql.push("'" + _company_id + "'");
		}

		let insertSql = 'INSERT INTO planning (`' + columnsSql.join("`,`") + '`) VALUES (' + dataSql.join() + ')';

		const response = this.sequelize.query(insertSql);

		response
			.then(d =>
				res.status(200).send(d)
			)
			.catch((err) => {
				res.createErrorLogAndSend({
					message: err.message ||
						"Some error occurred while getting orders.",
				});
			});

	}


	updatePlanningModal = async (req, res) => {
		let company_id = req.company_id;
		let { type_id, order_id, resource_bank_id, passengers, chaperone_id, vehicle_id, driver_id, planning_id } = req.body;
		let resp = [];
		let showErrorParam = true;

		if (((!order_id && !passengers) || (!type_id && !order_id)) && (!planning_id)) {
			showErrorParam = false;
			return await res.createErrorLogAndSend({ message: "You should pass planning_id" });
		}

		if (resource_bank_id) {
			showErrorParam = false;
			resp.push(await this.sequelize.query(`UPDATE planning SET resource_bank_id = ${resource_bank_id} WHERE id = ${planning_id}`));
			await alertUtils.updateAlertsFunction(this.sequelize);
		}

		if (chaperone_id) {
			showErrorParam = false;
			resp.push(await this.sequelize.query(`UPDATE planning SET chapeeron_id = ${chaperone_id} WHERE id = ${planning_id}`));
			await alertUtils.updateAlertsFunction(this.sequelize);
		}

		if ((vehicle_id || driver_id) && !resource_bank_id) {
			vehicle_id = vehicle_id ? ("'" + vehicle_id + "'") : null;
			driver_id = driver_id ? ("'" + driver_id + "'") : null;
			showErrorParam = false;
			let insertResp = await this.sequelize.query(`INSERT INTO resource_bank (company_id,vehicle_id,driver_id) VALUES (${company_id}, ${vehicle_id}, ${driver_id})`);
			resp.push(insertResp);
			if (insertResp && insertResp.length > 0) {
				let chaperoneUpdate = '';
				if (chaperone_id) {
					chaperoneUpdate = `,chapeeron_id = ${chaperone_id}`;
				}
				resp.push(await this.sequelize.query(`UPDATE planning SET resource_bank_id = ${insertResp[0]} ${chaperoneUpdate} WHERE id = ${planning_id}`));
				await alertUtils.updateAlertsFunction(this.sequelize);
			}
		}

		if (order_id && passengers) {
			showErrorParam = false;
			resp.push(await this.sequelize.query(`UPDATE orders SET passengers = ${passengers} WHERE id = ${order_id}`));
		}

		if (type_id && order_id) {
			showErrorParam = false;
			resp.push(await this.sequelize.query(`UPDATE orders SET type_id = ${type_id} WHERE id = ${order_id}`));
		}

		if (showErrorParam) {
			return await res.createErrorLogAndSend({
				message: `You should pass: (planning_id AND resource_bank_id) OR (planning_id AND chaperone_id) OR (planning_id AND (vehicle_id OR driver_id) AND not resource_bank_id) OR (order_id AND passengers) OR (type_id AND order_id)`
			});
		} else {
			return res.send(resp);
		}

	}

	removeOrderFromPlanning = async (req, res) => {
		let { order_id, planning_id } = req.body;
		let company_id = req.company_id;
		let resp;

		if (!order_id && !planning_id) {
			return await res.createErrorLogAndSend({ message: "You should pass order_id or planning_id" });
		}

		let where = '';
		if (order_id) {
			where = `order_id = ${order_id}`;
		} else if (planning_id) {
			where = `id = ${planning_id}`;
		}

		let updateSqlQuery = `DELETE FROM planning WHERE ${where} AND company_id = ${company_id}; `;
		resp = await this.sequelize.query(updateSqlQuery);
		return res.send(resp);

	}



}


export default PlanningControllerPlanner;

