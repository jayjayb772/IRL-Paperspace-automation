const express = require('express');
const {insertMachine} = require("./databaseFunctions");
const {insertUser} = require("./databaseFunctions");
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

/**
 * @swagger
 *
 * definitions:
 *
 *   User:
 *    type: object
 *    properties:
 *     user_id:
 *      type: string
 *      format: message
 *      example: "DPAUL1234"
 *     name:
 *      type: string
 *      format: message
 *      example: "De Paul"
 *     email_address:
 *      type: string
 *      format: message
 *      example: "myemail@depaul.edu"
 *     paperspace_email_address:
 *      type: string
 *      format: message
 *      example: "myemail@email.com"
 *     verified_in_paperspace:
 *      type: integer
 *      format: message
 *      example: "0 or 1"
 *     paperspace_user_id:
 *      type: string
 *      format: message
 *      example: "userId or null"
 *     assigned_machine:
 *      type: string
 *      format: message
 *      example: "machineID or null"
 *     reservations:
 *      type: string
 *      format: message
 *      example: "['CK-012345']"
 *
 *   Reservation:
 *    type: object
 *    properties:
 *     reservation_id:
 *      type: string
 *      format: message
 *      example: "CK-012345"
 *     user_id:
 *      type: string
 *      format: message
 *      example: "DPAUL123"
 *     start_ts:
 *      type: string
 *      format: message
 *      example: "YYYY-MM-DDTHH:MM:SS.000000-05:00"
 *     end_ts:
 *      type: string
 *      format: message
 *      example: "YYYY-MM-DDTHH:MM:SS.000000-05:00"
 *     status:
 *      type: string
 *      format: message
 *      example: "RESERVATION"
 *
 *   Machine:
 *    type: object
 *    properties:
 *     machine_id:
 *      type: string
 *      format: message
 *      example: "ps29124"
 *     machine_name:
 *      type: string
 *      format: message
 *      example: "IRL1"
 *     in_use:
 *      type: integer
 *      format: message
 *      example: "0 or 1"
 *     state:
 *      type: string
 *      format: message
 *      example: "ready"
 *     assigned_to:
 *      type: string
 *      format: message
 *      description: paperspace user id of assigned user
 *      example: "us12314"
 *
 */

//region /users

/**
 * @swagger
 *
 * /database/users:
 *   get:
 *     description: gets all users in db
 *     tags:
 *       - user
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: send user list
 *       500:
 *         description: Internal Server Error
 */
dbController.get('/users', ((req, res) => {
        searchUsers().then(response => {
            res.send(response)
        }).catch(err => {
            res.status(err.statusCode);
            res.send(err)
        })
    }
))

/**
 * @swagger
 * /database/users/{userid}:
 *   get:
 *     description: gets user from specified id
 *     tags:
 *       - user
 *     parameters:
 *      - in: path
 *        name: userid
 *        schema:
 *         type: string
 *        required: true
 *        description: WCO user id of user you are updating
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: send user
 *       404:
 *         description: user not found
 *       500:
 *         description: Internal Server Error
 */
dbController.get('/users/:userid', ((req, res) => {
        searchUsers(req.params.userid).then(response => {
            console.log("hello")
            console.log(response)
            res.send(response)
        }).catch(err => {
            res.status(err.statusCode);
            res.send(err)
        })
    }
))

/**
 * @swagger
 *
 * /database/users/{userid}:
 *   patch:
 *     description: updates user in database
 *     tags:
 *       - user
 *     produces:
 *       - application/json
 *     parameters:
 *      - in: path
 *        name: userid
 *        schema:
 *         type: string
 *        required: true
 *        description: WCO user id of user you are updating
 *     requestBody:
 *      description: Request body for updating user in the database, can use all, some, or 1 params
 *      required: true
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/definitions/User'
 *     responses:
 *       204:
 *         description: successfully updated user
 *       400:
 *         description: Bad request body
 *       404:
 *         description: Resource not found
 *       500:
 *         description: Internal Server Error
 */
dbController.patch('/users/:userid', ((req, res) => {
    updateUser(req.params.userid, req.body).then(response => {
        res.status(204)
            res.send(response)
        }).catch(err => {
            res.status(err.statusCode);
            res.send(err)
        })
    }
))

/**
 * @swagger
 * /database/users:
 *   post:
 *     description: adds user to database
 *     tags:
 *       - user
 *     produces:
 *       - application/json
 *     requestBody:
 *      description: Request body for adding user to the database
 *      required: true
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/definitions/User'
 *     responses:
 *       201:
 *         description: successfully added user
 *       400:
 *         description: Bad request body
 *       500:
 *         description: Internal Server Error
 */
dbController.post('/users', (req,res)=>{
    insertUser(req.body).then(response=>{
        res.status(201)
        res.send(response)
    }).catch(err=>{
        res.status(err.statusCode)
        res.send(err)
    })
})


/**
 * @swagger
 *
 * /database/users/{userid}/verify:
 *   get:
 *     description: verifys user is in paperspace team and updates db accordingly
 *     tags:
 *       - user
 *     parameters:
 *      - in: path
 *        name: userid
 *        schema:
 *         type: string
 *        required: true
 *        description: WCO user id of user you are verifying
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: user is verified
 *       201:
 *         description: verified user and updated
 *       400:
 *         description: bad request
 *       404:
 *         description: user does not exist
 *       500:
 *         description: Internal Server Error
 */
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
    }))

//endregion

//region /reservations
/**
 * @swagger
 * /database/reservations:
 *   get:
 *     description: gets all reservations in db
 *     tags:
 *       - reserve
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: send reservation list
 *       500:
 *         description: Internal Server Error
 */
dbController.get('/reservations', ((req, res) => {
        searchReservationsById().then(response => {
            res.send(response)
        }).catch(err => {
            res.status(err.statusCode);
            res.send(err)
        })
    }
))

/**
 * @swagger
 * /database/reservations:
 *   post:
 *     description: adds reservation to database
 *     tags:
 *       - reserve
 *     produces:
 *       - application/json
 *     requestBody:
 *      description: Request body for adding reservation to the database
 *      required: true
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/definitions/Reservation'
 *     responses:
 *       201:
 *         description: successfully added reservation
 *       400:
 *         description: Bad request body
 *       404:
 *         description: Resource not found
 *       500:
 *         description: Internal Server Error
 */
dbController.post('/reservations', ((req, res) => {
    let reservation = reservationDTO(req.body)
        insertReservation(reservation).then(response => {
            res.status(201)
            res.send(response)
        }).catch(err => {
            res.status(err.statusCode);
            res.send(err)
        })
    }
))

/**
 * @swagger
 * /database/reservations/{reservationid}:
 *   get:
 *     description: gets reservation from specified id
 *     tags:
 *       - reserve
 *     parameters:
 *      - in: path
 *        name: reservationid
 *        schema:
 *         type: string
 *        required: true
 *        description: WCO name of reservation
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: send reservation
 *       404:
 *         description: reservation not found
 *       500:
 *         description: Internal Server Error
 */
dbController.get('/reservations/:reservationid', ((req, res) => {
        searchReservationsById(req.params.reservationid).then(response => {
            res.send(response)
        }).catch(err => {
            res.status(err.statusCode);
            res.send(err)
        })
    }
))

/**
 * @swagger
 * /database/reservations/{reservationid}:
 *   patch:
 *     description: updates reservation in database
 *     tags:
 *       - reserve
 *     produces:
 *       - application/json
 *     parameters:
 *      - in: path
 *        name: reservationid
 *        schema:
 *         type: string
 *        required: true
 *        description: id of reservation you are updating
 *     requestBody:
 *      description: Request body for updating reservation in the database
 *      required: true
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/definitions/Reservation'
 *     responses:
 *       204:
 *         description: successfully updated reservation
 *       400:
 *         description: Bad request body
 *       404:
 *         description: Resource not found
 *       500:
 *         description: Internal Server Error
 */
dbController.patch('/reservations/:reservationid', ((req, res) => {
        updateReservationInfo(req.params.reservationid, req.body).then(response => {
            res.status(204)
            res.send(response)
        }).catch(err => {
            res.status(err.statusCode);
            res.send(err)
        })
    }
))
//endregion

//region /machines

/**
 * @swagger
 * /database/machines:
 *   get:
 *     description: gets all machines in DB
 *     tags:
 *       - machine
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: send machine list
 *       500:
 *         description: Internal Server Error
 */
dbController.get('/machines', ((req, res) => {
        searchMachines().then(response => {
            res.send(response)
        }).catch(err => {
            res.status(err.statusCode);
            res.send(err)
        })
    }
))

/**
 * @swagger
 * /database/machines/{machineid}:
 *   get:
 *     description: gets machine from specified id
 *     tags:
 *       - machine
 *     parameters:
 *      - in: path
 *        name: machineid
 *        schema:
 *         type: string
 *        required: true
 *        description: paperspace machine_id
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: send machine
 *       404:
 *         description: machine not found
 *       500:
 *         description: Internal Server Error
 */
dbController.get('/machines/:machineid', ((req, res) => {
        searchMachines(req.params.machineid).then(response => {
            res.send(response)
        }).catch(err => {
            res.status(err.statusCode);
            res.send(err)
        })
    }
))

/**
 * @swagger
 * /database/machines/{machineid}:
 *   patch:
 *     description: adds reservation to database
 *     tags:
 *       - machine
 *     produces:
 *       - application/json
 *     parameters:
 *      - in: path
 *        name: machineid
 *        schema:
 *         type: string
 *        required: true
 *        description: id of machine you are updating
 *     requestBody:
 *      description: Request body for updating machine in the database
 *      required: true
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/definitions/Machine'
 *     responses:
 *       204:
 *         description: successfully updated machine
 *       400:
 *         description: Bad request body
 *       404:
 *         description: Resource not found
 *       500:
 *         description: Internal Server Error
 */
dbController.patch('/machines/:machineid', ((req, res) => {
    console.log(req.body)
        updateMachine(req.params.machineid, req.body).then(response => {
            res.status(204)
            res.send(response)
        }).catch(err => {
            res.status(err.statusCode);
            res.send(err)
        })
    }
))

/**
 * @swagger
 *
 * /database/machines:
 *   post:
 *     description: adds machine to database
 *     tags:
 *       - machine
 *     produces:
 *       - application/json
 *     requestBody:
 *      description: Request body for adding machine to the database
 *      required: true
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/definitions/Machine'
 *     responses:
 *       201:
 *         description: successfully added machine
 *       400:
 *         description: Bad request body
 *       404:
 *         description: Resource not found
 *       500:
 *         description: Internal Server Error
 */
dbController.post('/machines', (req, res)=>{
    insertMachine(req.body).then(response=>{
        res.status(201)
        res.send(response)
    }).catch(err=>{
        res.status(err.statusCode)
        res.send(err)
    })
})

//endregion

module.exports = dbController