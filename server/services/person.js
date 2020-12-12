const express = require('express');
const router = express.Router();
const Person = require('./../models/person');
const Location = require('./../models/location');
const Sequelize = require('sequelize').Sequelize;
const _ = require('lodash');
const send = require('./send');
const moment = require('moment');

const getPeople = (req, res, next) => {
    const filter = req.body;
    const target = filter.birth ? 'birth_year' : 'death_year';
    const target_abbrev = filter.birth ? 'bl' : 'dl';
    const historical = filter.historical;
    query = `SELECT DISTINCT
        p.id AS person_id,
        p.name,
        p.birth,
        p.death,
        p.birth_year,
        p.death_year,
        p.historical,
        bl.id AS bl_id,
        bl.location AS bl_location,
        bl.coordinates AS bl_coordinates,
        bl.coordinates_accurate AS bl_coordinates_accurate,
        dl.id AS dl_id,
        dl.location AS dl_location,
        dl.coordinates AS dl_coordinates,
        dl.coordinates_accurate AS dl_coordinates_accurate,
        ${target_abbrev}.id AS location_id,
        ${target_abbrev}.lat AS lat,
        ${target_abbrev}.lng AS lng
    FROM person p
    LEFT JOIN location bl ON p.birth_location = bl.id
    LEFT JOIN location dl ON p.death_location = dl.id
    WHERE ${target} BETWEEN ${filter.start} AND ${filter.end}
    ${historical == 1 ? ` AND historical = 1 ` : ``}
    ORDER BY ${target}, name ASC`;
    console.log(query);
    Person.sequelize.query(query, {
        type: Person.sequelize.QueryTypes.SELECT
    }).then(results => {
        req.output = results;
        return next();
    })
}

const getAllPeople = (req, res, next) => {
    // Big ol' query to just return everything and everyone
    Person.sequelize.query(`SELECT
            p.id AS person_id,
            p.name,
            p.birth,
            p.death,
            p.birth_year,
            p.death_year,
            p.historical,
            bl.id AS bl_id,
            bl.location AS bl_location,
            bl.coordinates AS bl_coordinates,
            bl.coordinates_accurate AS bl_coordinates_accurate,
            dl.id AS dl_id,
            dl.location AS dl_location,
            dl.coordinates AS dl_coordinates,
            dl.coordinates_accurate AS dl_coordinates_accurate
        FROM person p
        LEFT JOIN location bl ON p.birth_location = bl.id
        LEFT JOIN location dl ON p.death_location = dl.id`,
    {
        type: Person.sequelize.QueryTypes.SELECT
    }).then(people => {
        req.output = people;
        return next();
    }).catch(err => {
        console.log(err);
        return next(err);
    });
}

const _initOutput = (req, res, next) => {
    req.output = {};
    return next();
}

const _getPerson = (req, res, next) => {
    const id = req.params.id;
    Person.findByPk(id).then(person => {
        req.output.person = person;
        return next();
    });
}

const _getBirthLocation = (req, res, next) => {
    const birth_location = _.get(req.output, 'person.birth_location', null);
    if (!birth_location) {
        req.output.birth_location = {};
        return next();
    } else {
        Location.findByPk(birth_location).then(location => {
            req.output.birth_location = location;
            return next();
        });
    }
}

const _getDeathLocation = (req, res, next) => {
    const death_location = _.get(req.output, 'person.death_location', null);
    if (!death_location) {
        req.output.death_location = {};
        return next();
    } else {
        Location.findByPk(death_location).then(location => {
            req.output.death_location = location;
            return next();
        });
    }
}

const _getParents = (req, res, next) => {
    req.output.parents = [];
    return next();
}

const _getChildren = (req, res, next) => {
    req.output.children = [];
    return next();
}

const _getSiblings = (req, res, next) => {
    req.output.siblings = [];
    return next();
}

const updatePerson = (req, res, next) => {
    const id = req.params.id;
    Person.findByPk(id).then(person => {
        // Account for cases when the birth and death years got changed. We need to parse that and get the new years
        if (req.body.birth && (req.body.birth !== person.birth)) {
            const birth_year = moment(req.body.birth).year();
            person.birth_year = birth_year;
        }
        if (req.body.death && (req.body.death !== person.death)) {
            const death_year = moment(req.body.death).year();
            person.death_year = death_year;
        }
        person.name = _.get(req.body, 'name', person.name);
        person.birth = _.get(req.body, 'birth', person.birth);
        person.death = _.get(req.body, 'death', person.death);
        person.historical = _.get(req.body, 'historical', person.historical);
        person.save().then(savedPerson => {
            req.output = savedPerson;
            return next();
        });
    });
}

const getUnhistorical = (req, res, next) => {
    // Big ol' query to just return everything and everyone
    Person.sequelize.query(`SELECT
            p.id AS person_id,
            p.name,
            p.birth,
            p.death,
            p.birth_year,
            p.death_year,
            bl.id AS bl_id,
            bl.location AS bl_location,
            dl.id AS dl_id,
            dl.location AS dl_location
        FROM person p
        LEFT JOIN location bl ON p.birth_location = bl.id
        LEFT JOIN location dl ON p.death_location = dl.id
        WHERE p.historical = 0
        ORDER BY LOWER(p.name) ASC`,
    {
        type: Person.sequelize.QueryTypes.SELECT
    }).then(people => {
        req.output = people;
        return next();
    }).catch(err => {
        console.log(err);
        return next(err);
    });
}

router.get('/api/person/list', getAllPeople, send);
router.get('/api/person/unhistorical', getUnhistorical, send);
router.get('/api/person/:id', _initOutput, _getPerson, _getBirthLocation, _getDeathLocation, _getParents, _getChildren, _getSiblings, send);
router.post('/api/people', getPeople, send);
router.put('/api/person/:id', updatePerson, send);
module.exports = router;