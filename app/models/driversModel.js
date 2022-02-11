export default (sequelize, DataTypes) => {
  const Drivers = sequelize.define("drivers", {
    company_id: {
      type: DataTypes.INTEGER,
    },
    first_name: {
      type: DataTypes.STRING,
    },
    last_name: {
      type: DataTypes.STRING,
    },
    nick_name: {
      type: DataTypes.STRING,
    },
    driver_code: {
      type: DataTypes.INTEGER,
    },
    car_number: {
      type: DataTypes.STRING,
    },
    phone_number: {
      type: DataTypes.STRING,
    },
    is_active: {
      type: DataTypes.INTEGER,
    },
    driver_code: {
      type: DataTypes.INTEGER,
    },
    type_id: {
      type: DataTypes.INTEGER,
    },
    total_points: {
      type: DataTypes.INTEGER,
    },
    total_points: {
      type: DataTypes.INTEGER,
    },
    image: {
      type: DataTypes.BLOB,
    },
    school_visa: {
      type: DataTypes.INTEGER,
    },
    military_visa: {
      type: DataTypes.INTEGER,
    },
    weapons_license: {
      type: DataTypes.STRING,
    },
    license_year: {
      type: DataTypes.STRING,
    },
    license_type: {
      type: DataTypes.STRING,
    },
    license_number: {
      type: DataTypes.STRING,
    },
    partner_phone: {
      type: DataTypes.STRING,
    },
    partner_name: {
      type: DataTypes.STRING,
    },
    languages: {
      type: DataTypes.STRING,
    },
    rating: {
      type: DataTypes.STRING,
    },
    scopes: {
      type: DataTypes.STRING(255),
    },
    car_number: {
      type: DataTypes.STRING,
    },
  });
  return Drivers;
};
