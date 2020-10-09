const express = require('express');
const {searchMachines} = require("./databaseFunctions");
const {searchReservations} = require("./databaseFunctions");
const {searchUsers} = require("./databaseFunctions");
const dbController = express.Router()

dbController.get('/users', ((req, res) => {
        searchUsers().then(response => {
            res.send(response)
        }).catch(err => {
            res.status(err.statusCode);
            res.send(err)
        })
    }
))

dbController.get('/reservations', ((req, res) => {
        searchReservations().then(response => {
            res.send(response)
        }).catch(err => {
            res.status(err.statusCode);
            res.send(err)
        })
    }
))

dbController.get('/machines', ((req, res) => {
        searchMachines().then(response => {
            res.send(response)
        }).catch(err => {
            res.status(err.statusCode);
            res.send(err)
        })
    }
))

module.exports = dbController