import CompanyController from "../controllers/companyController";

export default (router, app) => {
  const modelBase = "company";
  const modelIdentifier = "id";
  const companyController = new CompanyController(app, modelBase);

  router.get(
    `/${modelBase}`,
    companyController.getCompany.bind(companyController)
  );

  router.post(
    `/${modelBase}/add`,
    companyController.addStation.bind(companyController)
  );

  router.post(
    `/${modelBase}/add-bulk`,
    companyController.addBulkCompany.bind(companyController)
  );

  router.get(
    `/${modelBase}/company-events`,
    companyController.companyEvents.bind(companyController)
  );

  router.get(
    `/${modelBase}/company-rules`,
    companyController.companyRules.bind(companyController)
  );

  router.get(
    `/${modelBase}/dictionary`,
    companyController.dictionary.bind(companyController)
  );



  // router.get(`/${modelBase}`, vehicleController.getAll.bind(vehicleController));

  // router.get(`/${modelBase}/:${modelIdentifier}`, vehicleController.getOne.bind(vehicleController));

  // router.post(`/${modelBase}`, vehicleController.create.bind(vehicleController));

  // router.put(`/${modelBase}/:${modelIdentifier}`, vehicleController.update.bind(vehicleController));

  // router.delete(`/${modelBase}/:${modelIdentifier}`, vehicleController.deleteOne.bind(vehicleController));
};

// import { ServerErrors, ServerMessages } from "../constants/ServerMessages";
// const express = require('express');
// const router = express.Router();

// const dbs = require("../models");
// const Company = dbs.company;
// const Op = dbs.Sequelize.Op;
