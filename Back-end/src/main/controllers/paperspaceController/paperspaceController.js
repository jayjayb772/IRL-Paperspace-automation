const {giveAccessFromEmail} =  require("./paperspaceService");
const express = require('express');
const paperspaceController = express.Router()

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
 *   Author:
 *    type: object
 *    required:
 *     - name
 *    properties:
 *     name:
 *      type: string
 *      example: "author name"
 *
 *   Commits:
 *    type: object
 *    required:
 *     - message
 *     - added
 *     - removed
 *     - modified
 *    properties:
 *     message:
 *      type: string
 *      example: "Commit Message"
 *      format: message
 *     author:
 *      type: object
 *      $ref: '#/definitions/Author'
 *     added:
 *      type: array
 *      items:
 *       type: string
 *       example: ["/example/example.js", "test/test.js"]
 *     removed:
 *      type: array
 *      items:
 *       type: string
 *       example: ["/example/example.js", "test/test.js"]
 *     modified:
 *      type: array
 *      items:
 *       type: string
 *       example: ["/example/example.js", "test/test.js"]
 *
 *   HeadCommit:
 *    type: object
 *    required:
 *     - url
 *    properties:
 *     url:
 *      type: string
 *      format: message
 *
 *
 *   PushEvent:
 *     type: object
 *     required:
 *       - repository
 *       - commits
 *       - head_commit
 *     properties:
 *       repository:
 *         description: Repository object
 *         required: true
 *         type: object
 *         $ref: '#/definitions/Repository'
 *       commits:
 *         description: Commits object
 *         required: true
 *         type: array
 *         items:
 *          type: object
 *          $ref: '#/definitions/Commits'
 *          example: [{}, {}]
 *       head_commit:
 *         description: Head object
 *         required: true
 *         type: object
 *         $ref: '#/definitions/HeadCommit'
 */



/**
 * @swagger
 *
 * /paperspace/:
 *   get:
 *     description: gets all contact lists
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: send a text
 */
paperspaceController.get('/', (req, res) => {
    res.send("paperspace Controller home");
})


/**
 * @swagger
 *
 * /paperspace/give-access-from-email:
 *   post:
 *     description: gives access to machine
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
paperspaceController.post('/give-access-from-email', async (req, res) => {
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
 * /paperspace/revoke-access-from-email:
 *   post:
 *     description: revokes access to machine
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
paperspaceController.post('/revoke-access-from-email', async (req, res) => {

    giveAccessFromEmail(req.body).then(paperspaceRes=>{
        res.send(`gave ${req.body.email} access to paperspace machine #### ${paperspaceRes}`)
    }).catch(err=>{
        res.status(err.statusCode);
        res.send(err);
    })
})
module.exports = paperspaceController;