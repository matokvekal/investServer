module.exports = (sequelize, DataTypes) => {
    const LocationInfo = sequelize.define("location_info", {
        company_id: {
            type: DataTypes.INTEGER
        },
        source: {
            type: DataTypes.STRING,
        },
        last_latitude: {
            type: DataTypes.STRING,
        },
        last_longitude: {
            type: DataTypes.STRING,
        },
        last_location_time: {
            type: DataTypes.DATE
        },
        plate_number: {
            type: DataTypes.STRING,
        },
        platfrom_id: {
            type: DataTypes.INTEGER
        },
        current_driver_id: {
            type: DataTypes.INTEGER
        },
        UAID: {
            type: DataTypes.STRING,
        },
        is_row_updated: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    });
    return LocationInfo;
};

