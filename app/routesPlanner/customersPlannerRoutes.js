
import CustomersControllerPlanner from "../controllersPlanner/customersControllerPlanner";

export default (router, app) => {
  const modelBase = "customers";
  const customersControllerPlanner = new CustomersControllerPlanner(app, modelBase);

  router.get(
    `/${modelBase}`,
    customersControllerPlanner.getAllCustomers.bind(customersControllerPlanner)
  );
};
