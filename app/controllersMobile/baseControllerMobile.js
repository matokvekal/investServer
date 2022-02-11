import Logger from "../utils/Logger";
class BaseControllerMobile {
  modelName = "";
  _dbModel = null;
  app = null;

  constructor(app, modelName) {
    this.app = app;
    this.modelName = modelName;
  }

  get dbModel() {

    if (!this.modelName) {
      Logger.error("Missing model name");
    }

    if (!this._dbModel) {
      this._dbModel = this.app.get("dbModels")[this.modelName];
    }
    return this._dbModel;
  }

  get sequelize() {
    return this.app.get("dbModels").sequelize;
  }

}

export default BaseControllerMobile;
