const db = require('./db');
const Sequelize = require('sequelize').Sequelize;

module.exports = db.define('person', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: Sequelize.STRING,
    birth: Sequelize.STRING,
    death: Sequelize.STRING,
    birth_location: Sequelize.INTEGER,
    death_location: Sequelize.INTEGER,
    historical: Sequelize.INTEGER,
    birth_year: Sequelize.INTEGER,
    death_year: Sequelize.INTEGER
}, {
    freezeTableName: true,
    timestamps: false
});