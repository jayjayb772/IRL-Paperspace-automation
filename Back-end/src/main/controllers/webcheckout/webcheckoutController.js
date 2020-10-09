const express = require('express');
const webcheckoutController = express.Router()
const {startNewSession} = require('./webcheckoutServices/webcheckoutAuth')


/**
 * @swagger
 *
 * definitions:
 *
 *   Email:
 *    type: object
 *    required:
 *     - email
 *    properties:
 *     email:
 *      type: string
 *      format: message
 *      example: "email@email.com"
 *
 *   State:
 *    type: object
 *    required:
 *     - state
 *    properties:
 *     state:
 *      type: string
 *      format: message
 *      example: "ready"
 *
 */

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
            res.status(500);
            res.send(err)
        })
    }
))

module.exports = webcheckoutController