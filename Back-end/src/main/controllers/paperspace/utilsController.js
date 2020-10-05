const express = require('express');
const {listMachines} = require("./paperspaceUtils");
const {listUsers} = require("./paperspaceUtils");
const utilsController = express.Router()

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
utilsController.get('/', (req, res) => {
    res.send("utils Controller home");
})


/**
 * @swagger
 *
 * /utils/machines:
 *   post:
 *     description: returns machines with given state
 *     produces:
 *       - application/json
 *     requestBody:
 *      description: state
 *      required: true
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/definitions/State'
 *     responses:
 *       200:
 *         description: found machines with state
 *       400:
 *         description: Bad request body
 *       404:
 *         description: Resource not found
 *       500:
 *         description: Internal Server Error
 *       501:
 *         description: Paperspace API Error
 */
utilsController.post('/machines', async (req, res) => {
        listMachines({state:req.body.state}).then(machinesRes => {
            res.send(machinesRes)
        }).catch(err => {
            res.status(err.statusCode);
            res.send(err);
        })
})

/**
 * @swagger
 *
 * /utils/machines:
 *   get:
 *     description: gets all machines in team
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: send machine list
 *       500:
 *         description: Internal Server Error
 *       501:
 *         description: Paperspace API Error
 */
utilsController.get('/machines', async (req, res) => {
    listMachines().then(machinesRes=>{
        res.send(machinesRes)
    }).catch(err=>{
        res.status(err.statusCode);
        res.send(err);
    })
})


/**
 * @swagger
 *
 * /utils/users:
 *   post:
 *     description: gets users based on email
 *     produces:
 *       - application/json
 *     requestBody:
 *      description: email
 *      required: true
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/definitions/Email'
 *     responses:
 *       200:
 *         description: successfully got user
 *       400:
 *         description: Bad request body
 *       404:
 *         description: user not found
 *       500:
 *         description: Internal Server Error
 *       501:
 *         description: Paperspace API Error
 */
utilsController.post('/users', async (req, res) => {
        listUsers({email:req.body.email}).then(usersRes => {
                res.send(usersRes)
        }).catch(err => {
            res.status(err.statusCode);
            res.send(err);
        })
})

/**
 * @swagger
 *
 * /utils/users:
 *   get:
 *     description: gets all users in team
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: send user list
 *       500:
 *         description: Internal Server Error
 *       501:
 *         description: Paperspace API Error
 */
utilsController.get('/users', async (req, res) => {
    listUsers().then(usersRes=>{
        res.send(usersRes)
    }).catch(err=>{
        res.status(err.statusCode);
        res.send(err);
    })
})


module.exports = utilsController;