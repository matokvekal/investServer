import express from 'express';
import * as middlewares from '../middlewares';
import initApiRoutes from './initApiRoutes';
import initPlannerRoutes from './initPlannerRoutes';
import initMobileRoutes from './initMobileRoutes';
import initHrRoutes from './initHrRoutes';
import initDatabase from './initDatabase';
import { ALL, CONTROL, DRIVER, PLANNER, HR } from '../constants/permissionStrings';
import momentTimeZone from 'moment-timezone';

momentTimeZone.tz.setDefault('Etc/UTC');

/**
 * Create all routes and middlewares
 * @returns {Promise<Application>}
 */

// const cors = require("cors");

export default async (config) => {
	const app = express();
	const apiRouter = express.Router();
	const mobileRouter = express.Router();
	const plannerRouter = express.Router();
	const hrRouter = express.Router();
	// app.use(cors({ origin: "http://localhost:3000", credentials: true }));
	const db = await initDatabase(config);

	app.set('dbModels', db);

	const allowedControlConfigObject = {
		//list of controllers
		authentication: ALL,
		[ALL]: CONTROL,
	};
	apiRouter.use(middlewares.apiMiddleware);
	apiRouter.use(middlewares.loggerMiddleware(db));
	apiRouter.use(middlewares.errorLoggerMiddleware(db));
	apiRouter.use(middlewares.textValidationMiddleware);
	apiRouter.use(middlewares.authenticationMiddleware(db));
	apiRouter.use(middlewares.userReqAmountCheckMiddleware(db));
	apiRouter.use(
		middlewares.controllerPermissionMiddleware(
			db,
			allowedControlConfigObject
		)
	);
	// apiRouter.use(middlewares.loggerMiddleware(db));
	initApiRoutes(apiRouter, app);


	// Planner
	const allowedPlannerConfigObject = {
		authentication: ALL,
		[ALL]: PLANNER,
	};

	plannerRouter.use(middlewares.apiMiddleware);
	plannerRouter.use(middlewares.loggerMiddleware(db));
	plannerRouter.use(middlewares.errorLoggerMiddleware(db));
	plannerRouter.use(middlewares.textValidationMiddleware);
	plannerRouter.use(middlewares.authenticationMiddleware(db));
	plannerRouter.use(middlewares.userReqAmountCheckMiddleware(db));
	plannerRouter.use(
		middlewares.controllerPermissionMiddleware(
			db,
			allowedPlannerConfigObject
		)
	);
	// plannerRouter.use(middlewares.loggerMiddleware(db));
	initPlannerRoutes(plannerRouter, app);


	// Mobile
	const allowedMobileConfigObject = {
		authentication: ALL,
		[ALL]: DRIVER,
	};

	mobileRouter.use(middlewares.apiMiddleware);
	mobileRouter.use(middlewares.loggerMiddleware(db));
	mobileRouter.use(middlewares.errorLoggerMiddleware(db));
	mobileRouter.use(middlewares.textValidationMiddleware);
	mobileRouter.use(middlewares.authenticationMiddleware(db));
	mobileRouter.use(middlewares.userReqAmountCheckMiddleware(db));
	mobileRouter.use(
		middlewares.controllerPermissionMiddleware(
			db,
			allowedMobileConfigObject
		)
	);
	// mobileRouter.use(middlewares.loggerMiddleware(db));
	initMobileRoutes(mobileRouter, app);


	//Hr
	const allowedHrConfigObject = {
		authentication: ALL,
		[ALL]: HR,
	};

	hrRouter.use(middlewares.apiMiddleware);
	hrRouter.use(middlewares.loggerMiddleware(db));
	hrRouter.use(middlewares.errorLoggerMiddleware(db));
	hrRouter.use(middlewares.textValidationMiddleware);
	hrRouter.use(middlewares.authenticationMiddleware(db));
	hrRouter.use(middlewares.userReqAmountCheckMiddleware(db));
	hrRouter.use(
		middlewares.controllerPermissionMiddleware(
			db,
			allowedHrConfigObject
		)
	);
	// hrRouter.use(middlewares.loggerMiddleware(db));
	initHrRoutes(hrRouter, app);


	// Routes

	app.use('/api/v1', apiRouter);
	app.use('/api/v1/mobile', mobileRouter);
	app.use('/api/v1/planner', plannerRouter);
	app.use('/api/v1/hr', hrRouter);
	// app.use('/api/v1', apiRouter);
	// app.use('/mobile/v1', mobileRouter);
	// app.use('/planner/v1', plannerRouter);
	app.use(middlewares.errorMiddleware);

	return app;
};
