import moment from 'moment';

var config = require('../config/index');
let creationArr = [];
let timer;

export const getLogRecordData = (req) => {
	const userName = req && req.user ? req.user.user_name : 'NO USER';
	return {
		user_name: userName,
		company_id: req.company_id,
		date: moment().toDate(),
		ip: `${req.socket.remoteAddress}`,
		path: `${req.path}`,
	};
};

export const getErrorLogRecordData = (req, error) => {
	return {
		...getLogRecordData(req),
		err: error,
	};
};

export const createErrorLog = async (db, req, error) => {
	const errorLogData = getErrorLogRecordData(req, error);
	await db.errorLogs.create({ ...errorLogData });
};

export const loggerDebounce = (func, timeout = 300) => {
	return (...args) => {
		clearTimeout(timer);
		const req = args[0];
		const logData = getLogRecordData(req);
		creationArr.push(logData);
		timer = setTimeout(() => {
			func.apply(this, args);
			creationArr = [];
		}, timeout);
	};
};

export const createLogs = async (db) => {
	if (creationArr && creationArr.length) {
		await db.logs.bulkCreate(creationArr);
		// console.log('createLog', creationArr.length);
	}
};

export const debouncedCreateLogs =
	// (action = createLogs) =>
	// (req, db) => {
	//   loggerDebounce(
	//     async () => await action(db),
	//     config.loggerDebounceAmountInMS
	//   )(req);
	// };


		(action = createLogs) =>
		(req, db) => {
			loggerDebounce(
				async () => await action(db),
				config.loggerDebounceAmountInMS
			)(req);
		};

export const createDebouncerForLogAction = (createLogAction) => {
	return debouncedCreateLogs(createLogAction);
};

// function to create a message log - NOT USED IN THE MIDDLEWARE
// export const createSingleLog = async (db, message) => {
//   return await db.logs.create({ message });
export const createSingleLog = async (db, req, message) => {
	return await db.logs.create({ ...getLogRecordData(req), message });
};
