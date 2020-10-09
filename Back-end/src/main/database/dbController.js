const express = require('express');
const {verifyUserInPaperspace} = require("../controllers/paperspace/paperspaceUtils");
const {updateReservation} = require("./databaseFunctions");
const {updateUser} = require("./databaseFunctions");
const {updateMachine} = require("./databaseFunctions");
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
dbController.get('/users/:userid', ((req, res) => {
        searchUsers(req.params.userid).then(response => {
            res.send(response)
        }).catch(err => {
            res.status(err.statusCode);
            res.send(err)
        })
    }
))
dbController.patch('/users/:userid', ((req, res) => {
        updateUser(req.params.userid, req.body).then(response => {
            res.send(response)
        }).catch(err => {
            res.status(err.statusCode);
            res.send(err)
        })
    }
))
dbController.get('/users/:userid/verify', ((req, res) => {
    searchUsers(req.params.userid).then(user=>{
        if(user.length !== 1){
            res.status(404)
            res.send("Could not find specified user in t_users")
        }
        if(user[0].paperspace_email_address === null){
            res.status(400);
            res.send("No paperspace email address given for this user. please use the patch endpoint to update this field")
        }
        verifyUserInPaperspace(user[0]).then(verifyRes=>{
            res.send(verifyRes)
        }).catch(err=>{
            res.status(err.statusCode)
            res.send(err)
        })
    }).catch(err=>{
        res.status(err.statusCode)
        res.send(err)
    })



    /*
searchUsers(req.params.userid).then(response => {
        res.send(response)
    }).catch(err => {
        res.status(err.statusCode);
        res.send(err)
    })
*/
    }))

dbController.get('/reservations', ((req, res) => {
        searchReservations().then(response => {
            res.send(response)
        }).catch(err => {
            res.status(err.statusCode);
            res.send(err)
        })
    }
))
dbController.get('/reservations/:reservationid', ((req, res) => {
        searchReservations(req.params.reservationid).then(response => {
            res.send(response)
        }).catch(err => {
            res.status(err.statusCode);
            res.send(err)
        })
    }
))
dbController.patch('/reservations/:reservationid', ((req, res) => {
        updateReservation(req.params.reservationid, req.body).then(response => {
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
dbController.get('/machines/:machineid', ((req, res) => {
        searchMachines(req.params.machineid).then(response => {
            res.send(response)
        }).catch(err => {
            res.status(err.statusCode);
            res.send(err)
        })
    }
))
dbController.patch('/machines/:machineid', ((req, res) => {
        updateMachine(req.params.machineid, req.body).then(response => {
            res.send(response)
        }).catch(err => {
            res.status(err.statusCode);
            res.send(err)
        })
    }
))

module.exports = dbController