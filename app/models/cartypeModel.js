module.exports = (sequelize, DataTypes) => {
    const CarType = sequelize.define("cartype", {
        company_id: {
            type: DataTypes.INTEGER
        },
        code: {
            type: DataTypes.INTEGER
        },
        name: {
            type: DataTypes.STRING(50)
        },
        pass_qty: {
            type: DataTypes.INTEGER
        },
        size: {
            type: DataTypes.STRING(10)
        },
    });
    return CarType;
};


