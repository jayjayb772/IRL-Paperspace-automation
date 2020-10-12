const express = require('express');
const {getReservationsAndUpdateDB} = require("./webcheckoutServices/webcheckoutReservations");
const {getReservations} = require("./webcheckoutServices/webcheckoutReservations");
const webcheckoutController = express.Router()
const {startNewSession} = require('./webcheckoutServices/webcheckoutAuth')




/**
 * @swagger
 *
 * /wco/startSession:
 *   get:
 *     description: sets Session id and authenticates
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: success
 *       500:
 *         description: Internal Server Error
 *       501:
 *         description: WCO API Error
 */
webcheckoutController.get('/startSession', ((req, res) => {
        startNewSession().then(response => {
            res.send(response)
        }).catch(err => {
            res.status(err.statusCode);
            res.send(err)
        })
    }
))


//TODO update reservations


//TODO Check for upcoming reservations
/**
 * @swagger
 *
 * /wco/reservations:
 *   get:
 *     description: lists all reservations from wco api
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: success
 *       500:
 *         description: Internal Server Error
 *       501:
 *         description: WCO API Error
 */
webcheckoutController.get('/reservations', ((req, res) => {
        if (process.env.SID) {
            getReservationsAndUpdateDB().then(response => {
                res.send(response)
            }).catch(err => {
                res.status(err.statusCode);
                res.send(err)
            })
        } else {
            res.status(405)
            res.send("MUST START SESSION BEFORE CALLING WCO")
        }
    }

))




module.exports = webcheckoutController