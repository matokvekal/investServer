module.exports = (sequelize, DataTypes) => {
  const Resources = sequelize.define("resources", {
    company_id: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    company_code: {
      type: DataTypes.INTEGER,
      // allowNull: false
    },
    resource_type: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    resource_size: {
      type: DataTypes.STRING(45),
    },
    zone: {
      type: DataTypes.STRING(45),
      defaultValue: "north",
    },
    line_date: {
      type: DataTypes.DATE,
      // allowNull: false
    },
    is_active: {
      type: DataTypes.INTEGER,
    },
    line_code: {
      type: DataTypes.INTEGER,
    },
    order_start_time: {
      type: DataTypes.TIME,
      // allowNull: false
    },
    order_end_time: {
      type: DataTypes.TIME,
    },
    order_car_type: {
      type: DataTypes.INTEGER,
    },
    line_description: {
      type: DataTypes.STRING(240),
    },
    line_status: {
      type: DataTypes.INTEGER,
    },
    line_type: {
      type: DataTypes.INTEGER,
    },
    course_code: {
      type: DataTypes.INTEGER,
    },
    driver_id: {
      // TO BE ASSOC
      type: DataTypes.INTEGER,
    },
    driver_code: {
      type: DataTypes.INTEGER,
    },
    driver_first_name: {
      type: DataTypes.STRING(45),
    },
    driver_last_name: {
      type: DataTypes.STRING(45),
    },
    driver_nick_name: {
      type: DataTypes.STRING(45),
    },
    driver_phone: {
      type: DataTypes.STRING(45),
    },
    car_id: {
      type: DataTypes.INTEGER,
    },
    car_number: {
      type: DataTypes.STRING(15),
    },
    car_code: {
      type: DataTypes.INTEGER,
    },
    car_status: {
      type: DataTypes.STRING(45),
    },
    car_seats: {
      type: DataTypes.INTEGER,
    },
    client_id: {
      type: DataTypes.INTEGER,
      // allowNull: false
    },
    client_code: {
      type: DataTypes.INTEGER,
    },
    client_name: {
      type: DataTypes.STRING(45),
    },
    client_classification: {
      type: DataTypes.STRING(20),
    },
    chaperone_name: {
      type: DataTypes.STRING(45),
    },
    chaperones_id: {
      type: DataTypes.INTEGER,
    },
    chaperones_phone: {
      type: DataTypes.STRING,
    },
    stations: {
      type: DataTypes.TEXT,
    },
    comments: {
      type: DataTypes.TEXT,
    },
    latitude: {
      type: DataTypes.STRING(45),
    },
    longitude: {
      type: DataTypes.STRING(45),
    },
    position_last_update: {
      type: DataTypes.DATE,
    },
    position_source: {
      type: DataTypes.STRING,
    },
    position_user_update: {
      type: DataTypes.STRING(45),
    },
    resource_status: {
      type: DataTypes.STRING(45),
      defaultValue: "notActive",
    },
    trip_comment: {
      type: DataTypes.STRING(200),
    },
    current_trip_id: {
      type: DataTypes.INTEGER,
    },
    current_trip_name: {
      type: DataTypes.STRING(200),
    },
    current_trip_start_time: {
      type: DataTypes.TIME,
    },
    current_trip_end_time: {
      type: DataTypes.TIME,
    },
    next_trip_id: {
      type: DataTypes.INTEGER,
    },
    next_trip_name: {
      type: DataTypes.STRING,
    },
    total_trips: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    last_update_trip_data: {
      type: DataTypes.DATE,
    },
    date_range: {
      type: DataTypes.STRING(45),
    },
    data_source: {
      type: DataTypes.STRING(45),
      // allowNull: false
    },
    trip_done: {
      type: DataTypes.INTEGER,
    },
    comments_counter: {
      type: DataTypes.INTEGER,
    },
    fixed_filter: {
      type: DataTypes.INTEGER,
    },
    prev_station_id: {
      type: DataTypes.INTEGER,
    },
    next_station_id: {
      type: DataTypes.INTEGER,
    },
    created_by: {
      type: DataTypes.STRING(45),
    },
    icon_size: {
      type: DataTypes.STRING(45),
    }
  });

  // Resources.associate = function (models) {
  //     //     Resources.belongsToMany(models.trips, {
  //     //         through: models.trips_to_resource,
  //     //         constraints: false
  //     //     });
  //     // Resources.hasMany(models.trips_to_resource, { constraints: false });

  //     // ---
  //     Resources.hasMany(models.trips, { constraints: false });

  // }

  return Resources;
};
