import TasksControllerPlanner from "../controllersPlanner/tasksControllerPlanner";

export default (router, app) => {
  const modelBase = "tasks";
  const tasksControllerPlanner = new TasksControllerPlanner(app, modelBase);

  router.get(
    `/${modelBase}`,
    tasksControllerPlanner.getCurrentTasks.bind(tasksControllerPlanner)
  );
};
