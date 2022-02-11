module.exports = (sequelize, DataTypes) => {
    const TransitHistory = sequelize.define("transit_history", {
        company_id: {
            type: DataTypes.INTEGER
        },
        line_date: {
            type: DataTypes.DATE
        },
        is_active: {
            type: DataTypes.INTEGER
        },
        line_code: {
            type: DataTypes.INTEGER,
            unique: true
        },
        order_start_time: {
            type: DataTypes.TIME
        },
        order_end_time: {
            type: DataTypes.TIME
        },
        order_car_type: {
            type: DataTypes.STRING(45)
        },
        line_description: {
            type: DataTypes.TEXT
        },
        line_status: {
            type: DataTypes.INTEGER
        },
        line_type: {
            type: DataTypes.STRING(45)
        },
        course_code: {
            type: DataTypes.INTEGER
        },
        driver_code: {
            type: DataTypes.INTEGER
        },
        car_id: {
            type: DataTypes.INTEGER
        },
        car_code: {
            type: DataTypes.INTEGER
        },
        car_number: {
            type: DataTypes.STRING(45)
        },
        client_code: {
            type: DataTypes.INTEGER
        },
        last_action: {
            type: DataTypes.DATE
        },
        stations: {
            type: DataTypes.TEXT
        },
        data_splitted: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        // ------------
        // last_update: {
        //     type: DataTypes.DATE,
        //     allowNull: false,
        // },
        fetch_date: {
            type: DataTypes.DATEONLY,
        }
    });

    return TransitHistory;
};
