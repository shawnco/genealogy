const express = require('express');
const router = express.Router();
const Location = require('./../models/location');
const Person = require('./../models/person');
const Sequelize = require('sequelize').Sequelize;
const _ = require('lodash');
const moment = require('moment');
const send = require('./send');

// These routes are intended for managing and cleaning data

const fixPoints = (req, res, next) => {
    let updates = [];
    Location.sequelize.query(`SELECT * FROM location WHERE lat IS NULL`,
    {
        type: Location.sequelize.QueryTypes.SELECT
    }).then(locations => {
        locations.map(loc => {
            console.log(loc)
            const geocodeData = JSON.parse(loc.geocode_data);
            const geometry = _.get(geocodeData, 'results[0].geometry.location', null);
            if (geometry) {
                updates.push(Location.sequelize.query(`UPDATE location
                    SET lat = :lat,
                    lng = :lng
                    WHERE id = :id`,
                {
                    type: Location.sequelize.QueryTypes.UPDATE,
                    replacements: {
                        lat: geometry.lat,
                        lng: geometry.lng,
                        id: loc.id
                    }
                }));
            }
        });
        Promise.all(updates).then(done => {
            req.output = done;
            return next();
        });
    });
}

const fixCoordinates = (req, res, next) => {
    let updates = [];
    Location.findAll().then(locations => {
        locations.map(loc => {
            if (loc.coordinates) {
                const coords = loc.coordinates.split(', ');
                updates.push(Location.sequelize.query(`UPDATE location
                    SET lat = :lat,
                    lng = :lng
                    WHERE id = :id`,
                {
                    type: Location.sequelize.QueryTypes.UPDATE,
                    replacements: {
                        lat: coords[0],
                        lng: coords[1],
                        id: loc.id
                    }
                }));
            }
        })
    });
    Promise.all(updates).then(after => {
        console.log(after);
        return next();
    })
}

const fixYears = (req, res, next) => {
    let updates = [];
    Person.findAll().then(people => {
        people.map(person => {
            const birth = moment(person.birth);
            if (birth.isValid()) {
                updates.push(Person.sequelize.query(`UPDATE person
                    SET birth_year = :by
                    WHERE id = :id`,
                {
                    type: Person.sequelize.QueryTypes.UPDATE,
                    replacements: {
                        by: birth.year(),
                        id: person.id
                    }
                }).catch(err => {
                    console.log('There was an error updating birth for ', person.id)
                }));
            }

            const death = moment(person.death);
            if (death.isValid()) {
                updates.push(Person.sequelize.query(`UPDATE person
                    SET death_year = :by
                    WHERE id = :id`,
                {
                    type: Person.sequelize.QueryTypes.UPDATE,
                    replacements: {
                        by: death.year(),
                        id: person.id
                    }
                }).catch(err => {
                    console.log('There was an error updating death for ', person.id)
                }));
            }


        });
    });
    Promise.all(updates).then(after => {
        return next();
    })
}

router.get('/api/tools/fixCoordinates', fixCoordinates, send);
router.get('/api/tools/fixYears', fixYears, send);
router.get('/api/tools/fixPoints', fixPoints, send);
module.exports = router;