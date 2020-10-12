const {giveAccessFromEmail} =  require("./accessService");
const express = require('express');
const {loginToSite} = require("./accessService");
const {revokeAccessFromEmail} = require("./accessService");
const accessController = express.Router()

/**
 * @swagger
 *
 * definitions:
 *
 *   EnableAccessRequest:
 *    type: object
 *    required:
 *     - name
 *     - email
 *    properties:
 *     name:
 *      type: string
 *      format: name
 *      description: Your name
 *      example: "Your name"
 *     email:
 *      type: string
 *      format: email
 *      description: Email address associated with paperspace account
 *      example: "yourpaperspace@email.com"
 *
 *   LoginRequest:
 *    type: object
 *    required:
 *     - name
 *     - password
 *    properties:
 *     name:
 *      type: string
 *      format: name
 *      description: Your username
 *      example: "your username"
 *     password:
 *      type: string
 *      format: password
 *      description: password
 *      example: "password"
 *
 */




accessController.get('/', (req, res) => {
    res.send({msg:"access Controller home"});
})


/**
 * @swagger
 *
 * /access/give-access-from-email:
 *   post:
 *     description: gives access to machine
 *     tags:
 *       - paperspaceAccess
 *     produces:
 *       - application/json
 *     requestBody:
 *      description: Request body for giving access
 *      required: true
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/definitions/EnableAccessRequest'
 *     responses:
 *       200:
 *         description: successfully granted access
 *       400:
 *         description: Bad request body
 *       404:
 *         description: Resource not found
 *       500:
 *         description: Internal Server Error
 *       501:
 *         description: Paperspace API Error
 */
accessController.post('/give-access-from-email', async (req, res) => {
    console.log(req);
    giveAccessFromEmail(req.body).then(paperspaceRes=>{
            res.send(`Gave ${req.body.email} access to paperspace machine ${paperspaceRes.machineId}`)
        }).catch(err=>{
            res.status(err.statusCode);
            res.send(err);
        })
})


/**
 * @swagger
 *
 * /access/revoke-access-from-email:
 *   post:
 *     description: revokes access to machine
 *     tags:
 *       - paperspaceAccess
 *     produces:
 *       - application/json
 *     requestBody:
 *      description: Optional description in *Markdown*
 *      required: true
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/definitions/EnableAccessRequest'
 *     responses:
 *       200:
 *         description: successfully granted access
 *       400:
 *         description: Bad request body
 *       404:
 *         description: Resource not found
 *       500:
 *         description: Internal Server Error
 *       501:
 *         description: Paperspace API Error
 */
accessController.post('/revoke-access-from-email', async (req, res) => {

    revokeAccessFromEmail(req.body).then(paperspaceRes=>{
        res.send(`Removed ${req.body.email}'s access to paperspace machine ${paperspaceRes.machineId}`)
    }).catch(err=>{
        res.status((err.statusCode ? err.statusCode : 500));
        res.send(err);
    })
})

module.exports = accessController;