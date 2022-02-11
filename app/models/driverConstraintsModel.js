export default (sequelize, Types) => {
    const DriverConstraints = sequelize.define("driver_constraints", {
      driver_id: {
        type: Types.INTEGER,
        defaultValue: 1,
      },
      company_id: {
        type: Types.INTEGER,
      },
      from: {
        type: Types.TIME,
      },
      to: {
        type: Types.TIME,
      },
      is_active: {
        type: Types.INTEGER,
      },
      is_repeat: {
        type: Types.INTEGER,
      },
      description: {
        type: Types.STRING,
      },
      driver_phone: {
        type: Types.STRING,
      },
    });
  
    return DriverConstraints;
  };
  