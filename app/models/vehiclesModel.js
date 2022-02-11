export default (sequelize, DataTypes) => {
  const Vehicles = sequelize.define("vehicles", {
    car_id: {
      type: DataTypes.INTEGER,
    },
    car_code: {
      type: DataTypes.STRING,
    },
    car_number: {
      type: DataTypes.STRING,
    },
    v_licence: {
      type: DataTypes.STRING,
    },
    driver_id: {
      type: DataTypes.INTEGER,
    },
    driver_fname: {
      type: DataTypes.STRING,
    },
    driver_lname: {
      type: DataTypes.STRING,
    },
    driver_mobile2: {
      type: DataTypes.STRING,
    },
    size: {
      type: DataTypes.INTEGER,
    },
    seats: {
      type: DataTypes.INTEGER,
    },
    v_latitude: {
      type: DataTypes.STRING(15),
    },
    v_longitude: {
      type: DataTypes.STRING(15),
    },
    is_active: {
      type: DataTypes.INTEGER,
    },
    scope: {
      type: DataTypes.STRING,
    },
    type_id: {
      type: DataTypes.INTEGER,
    },
    available: {
      type: DataTypes.INTEGER,
    },
    custom1: {
      type: DataTypes.STRING,
    },
    custom2: {
      type: DataTypes.STRING,
    },
    custom3: {
      type: DataTypes.STRING,
    },

  });
  return Vehicles;
};
