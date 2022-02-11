import OrdersPlanner from "../controllersPlanner/ordersPlanner";

export default (router, app) => {
  const modelBase = "orders";
  const ordersPlanner = new OrdersPlanner(app, modelBase);

  router.get(`/${modelBase}`, ordersPlanner.getAllRecords.bind(ordersPlanner));

  router.get(
    `/${modelBase}/open-orders`,
    ordersPlanner.getOpenOrders.bind(ordersPlanner)
  );

  // add new order /api/v1/planner/orders/new-order
  router.post(
    `/${modelBase}/new-order`,
    ordersPlanner.addNewOrder.bind(ordersPlanner)
  );

  // duplicate order /api/v1/planner/orders/clone-order
  router.post(
    `/${modelBase}/clone-order`,
    ordersPlanner.duplicateOrder.bind(ordersPlanner)
  );

  // delete order /api/v1/planner/orders/remove-order
  router.post(
    `/${modelBase}/remove-order`,
    ordersPlanner.removeOrder.bind(ordersPlanner)
  );
};
