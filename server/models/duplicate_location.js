const db = require('./db');
const Sequelize = require('sequelize').Sequelize;

module.exports = db.define('duplicate_location', {
    location_id: Sequelize.INTEGER,
    group_id: Sequelize.INTEGER
}, {
    freezeTableName: true,
    timestamps: false
});