const express = require('express');
const router = express.Router();
const Location = require('./../models/location');
const DuplicateLocation = require('./../models/duplicate_location');
const Person = require('./../models/person');
const Sequelize = require('sequelize').Sequelize;
const _ = require('lodash');
const send = require('./send');
const fs = require('fs');
const parse = require('csv-parse');
const config = require('./config');
const rp = require('request-promise')

const _averageBoundaries = (bounds) => {
    return {
        lat: (bounds.northeast.lat + bounds.southwest.lat) / 2,
        lng: (bounds.northeast.lng + bounds.southwest.lng) / 2
    };
}

const geocodeLocations = (req, res, next) => {
    const baseurl = `https://maps.googleapis.com/maps/api/geocode/json?key=${config.google_api}&address=`;
    const count = req.params.count;
    const offset = req.params.offset;
    let query = 'SELECT id, location FROM location ';
    if (offset) {
        query += 'WHERE id > ' + offset + ' ';
    }
    if (count) { 
        query += 'LIMIT ' + count;
    }
    console.log(query)
    Location.sequelize.query(query, {
        type: Location.sequelize.QueryTypes.SELECT
    }).then(locations => {
        // For each location we need to make the request and THEN do the code to update its latlong
        const requests = locations.map(loc => {
            console.log('tone loc',loc)
            while (loc.location.indexOf(' ') > -1) {
                loc.location = loc.location.replace(' ', '+');
            }
            const options = {
                uri: baseurl,
                qs: {
                    key: config.google_api,
                    address: loc.location
                },
                json: true
            };
            return rp(options).then(response => {
                console.log(response)
                const bounds = _.get(response, 'results[0].geometry.bounds', null);
                const averageBounds = bounds ? _averageBoundaries(bounds) : null;
                const coordinates = averageBounds ? averageBounds.lat + ', ' + averageBounds.lng : null;
                const geocodeData = JSON.stringify(response);
                return Location.sequelize.query(`UPDATE location
                    SET coordinates = :coordinates,
                    geocode_data = :geocodeData,
                    lat = :lat,
                    lng = :lng
                    WHERE id = :id`,
                {
                    type: Location.sequelize.QueryTypes.UPDATE,
                    replacements: {
                        coordinates,
                        geocodeData,
                        lat: _.get(averageBounds, 'lat', null),
                        lng: _.get(averageBounds, 'lng', null),
                        id: loc.id
                    }
                });
            }).catch(err => console.log('had an error', err));
        });
        Promise.all(requests).then(results => {
            res.output = results;
            return next();
        });
    });
}

const getAllLocations = (req, res, next) => {
    Location.findAll().then(locations => {
        locations.map(loc => {
            const coords = _.get(loc, 'coordinates', null);
            loc.lat = coords ? parseFloat(coords.split(', ')[0]) : null,
            loc.lng = coords ? parseFloat(coords.split(', ')[1]) : null
        });
        req.output = locations;
        return next();
    }).catch(err => {
        console.log(err);
        return next(err);
    });
}

// const setLocationCoordinates = (req, res, next) => {
const setLocationCoordinates = () => {
    // const source = _.get(req.body, 'source', 'locations-2.csv');
    const source = 'locations-2.csv';
    fs.readFile(`./${source}`, (err, rows) => {
        if (err) { return console.log(err); }
        parse(rows.toString(), {}, (err1, output) => {
            let updates = [];
            output.map(out => {
                const location = out[0];
                const lat = out[1];
                const lng = out[2];
                const coordinates = lat + ', ' + lng;
                const accuracy = out[3];
                const geocode = JSON.stringify(out);
                updates.push(Location.sequelize.query(`UPDATE location
                    SET coordinates = :coordinates,
                    coordinates_accurate = :accuracy,
                    geocode_data = :geocode,
                    lat = :lat,
                    lng = :lng
                    WHERE location = :location`, 
                {
                    type: Location.sequelize.QueryTypes.UPDATE,
                    replacements: {coordinates, accuracy, geocode, lat, lng, location}
                }).catch(err => console.log(err)));
            });
            Promise.all(updates).then(after => console.log(after))
        });
    })
}
 
const getLocation = (req, res, next) => {
    const id = req.params.id;
    Location.findByPk(id).then(location => {
        req.output = location;
        return next();
    });
}

const _initOutput = (req, res, next) => {
    req.output = {};
    return next();
}

const _getLocation = (req, res, next) => {
    const id = req.params.id;
    Location.findByPk(id).then(location => {
        req.output.location = location;
        return next();
    });
}

const _getLocationBirths = (req, res, next) => {
    const filter = {
        where: {
            birth_location: req.params.id
        }
    };
    Person.findAll(filter).then(people => {
        req.output.birth = people;
        return next();
    });
}

const _getLocationDeaths = (req, res, next) => {
    const filter = {
        where: {
            death_location: req.params.id
        }
    };
    Person.findAll(filter).then(people => {
        req.output.death = people;
        return next();
    });
}

const _getDuplicateLocations = (req, res, next) => {
    DuplicateLocation.sequelize.query(`SELECT *
        FROM location l
        WHERE l.id IN (
            SELECT group_id FROM duplicate_location 
            WHERE location_id = :id
        )`,
        {
            type: DuplicateLocation.sequelize.QueryTypes.SELECT,
            replacements: {
                id: req.output.location.id
            }
        }).then(dupes => {
            req.output.duplicates = dupes;
            return next();
        });
}

const search = (req, res, next) => {
    const query = req.body.query;
    Location.sequelize.query(`SELECT * FROM location WHERE location LIKE '%${query}%'`,
    {
        type: Location.sequelize.QueryTypes.SELECT
    }).then(results => {
        req.output = results;
        return next();
    });
}

router.get('/api/location/list', getAllLocations, send);
router.get('/api/location/:id', getLocation, send);
router.get('/api/location/:id/full', _initOutput, _getLocation, _getLocationBirths, _getLocationDeaths, _getDuplicateLocations, send);
router.get('/api/location/geocode/:count/:offset?', geocodeLocations, send);
router.post('/api/location/search', search, send);
module.exports = {router, setLocationCoordinates}