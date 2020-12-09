const db = require('./db');
const Sequelize = require('sequelize').Sequelize;

module.exports = db.define('location', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    location: Sequelize.STRING,
    coordinates: Sequelize.STRING,
    coordinates_accurate: Sequelize.INTEGER,
    geocode_data: Sequelize.STRING,
    lat: Sequelize.DECIMAL,
    lng: Sequelize.DECIMAL
}, {
    freezeTableName: true,
    timestamps: false
});