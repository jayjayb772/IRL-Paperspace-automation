const express = require('express');
const {updateReservationInfo} = require("./databaseFunctions");
const {reservationDTO} = require("./dataObjects");
const {insertReservation} = require("./databaseFunctions");
const {bRes} = require("../util/betterhttpresponse");
const {verifyUserInPaperspace} = require("../controllers/paperspace/paperspaceUtils");
const {updateReservation} = require("./databaseFunctions");
const {updateUser} = require("./databaseFunctions");
const {updateMachine} = require("./databaseFunctions");
const {searchMachines} = require("./databaseFunctions");
const {searchReservationsById} = require("./databaseFunctions");
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
            return;
        }
        if(user[0].paperspace_email_address === null){
            res.status(400);
            res.send("No paperspace email address given for this user. please use the patch endpoint to update this field")
            return;
        }
        if(user[0].verified_in_paperspace === 1){
            res.status(200);
            res.send(bRes(200, "User is verified in paperspace!", "User is verified"))
            return;
        }
        verifyUserInPaperspace(user[0]).then(verifyRes=>{
            res.status(201)
            res.send(bRes(201, "Successfully verified user in Paperspace", `User ${req.params.userid} is in the paperspace team and ready to be assigned a machine`))
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
        searchReservationsById().then(response => {
            res.send(response)
        }).catch(err => {
            res.status(err.statusCode);
            res.send(err)
        })
    }
))

dbController.post('/reservations', ((req, res) => {
    let reservation = reservationDTO(req.body)
        insertReservation(reservation).then(response => {
            res.send(response)
        }).catch(err => {
            res.status(err.statusCode);
            res.send(err)
        })
    }
))

dbController.get('/reservations/:reservationid', ((req, res) => {
        searchReservationsById(req.params.reservationid).then(response => {
            res.send(response)
        }).catch(err => {
            res.status(err.statusCode);
            res.send(err)
        })
    }
))
dbController.patch('/reservations/:reservationid', ((req, res) => {
        updateReservationInfo(req.params.reservationid, req.body).then(response => {
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
    console.log(req.body)
        updateMachine(req.params.machineid, req.body).then(response => {
            res.send(response)
        }).catch(err => {
            res.status(err.statusCode);
            res.send(err)
        })
    }
))

module.exports = dbController