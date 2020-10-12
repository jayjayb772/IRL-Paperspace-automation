require('dotenv').config();
const express = require('express');
const app = express();
const ENV = process.env.ENV;
const jwt = require('express-jwt');
const jsonwebtoken = require('jsonwebtoken');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const cors = require('cors')
const accessController = require("./src/main/controllers/paperspace/accessController/accessController");
const utilsController = require("./src/main/controllers/paperspace/utilsController");
const {loginToSite} = require("./src/main/controllers/paperspace/accessController/accessService");
const db = require('./src/main/database/database')
const webcheckoutController = require("./src/main/controllers/webcheckout/webcheckoutController");
const dbController = require("./src/main/database/dbController");
const {betterLogging} = require("./src/main/util/betterLogging");
const {iterateReservationsRevoke} = require("./src/main/autoAssignMachines/iterateReservations");
const {iterateReservationsGive} = require("./src/main/autoAssignMachines/iterateReservations");
const {startNewSession} = require("./src/main/controllers/webcheckout/webcheckoutServices/webcheckoutAuth");
const {getReservationsAndUpdateDB} = require("./src/main/controllers/webcheckout/webcheckoutServices/webcheckoutReservations");
const swagOptions = {
    definition: {
        openapi: '3.0.0', // Specification (optional, defaults to swagger: '2.0')
        info: {
            title: 'IRL Paperspace control API', // Title (required)
            version: '1.0.0', // Version (required)
        },
    },
    tags: [
        {
            name: 'paperspaceUtils',
            description: 'Paperspace Utility endpoints'
        },
        {
            name: 'paperspaceAccess',
            description: 'Paperspace Access control endpoints'
        },
        {
            name: 'wco',
            description: 'Webcheckout endpoints'
        },{
            name: 'db',
            description: 'Database Endpoints'
        },{
            name: 'machine',
            description: 'Machine Endpoints'
        },{
            name: 'user',
            description: 'User Endpoints'
        },{
            name: 'reserve',
            description: 'Reservation Endpoints'
        },{
            name: 'access',
            description: 'Login Endpoints'
        }

    ],
    // Path to the API docs
    apis: ['./src/main/controllers/webcheckout/webcheckoutController.js',
        './src/main/controllers/paperspace/utilsController.js',
        './src/main/controllers/paperspace/accessController/accessController.js',
        './src/main/database/dbController.js',
        './*.js'],
};
const swaggerSpec = swaggerJSDoc(swagOptions);

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())

const jwtSecret = process.env.JWT_SECRET;

/**
 * @swagger
 *
 * /login:
 *   post:
 *     description: login to change access
 *     produces:
 *       - application/json
 *     tags:
 *       - access
 *     requestBody:
 *      description: Body used to log in as admin
 *      required: true
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/definitions/LoginRequest'
 *     responses:
 *       200:
 *         description: successfully logged in
 *       400:
 *         description: Bad request body
 *       401:
 *         description: not authorized
 *       500:
 *         description: Internal Server Error
 */
app.post('/login', async (req, res) => {
    console.log("LOG")
    loginToSite(req.body).then(loginRes=>{
        console.log(loginRes)
        if(loginRes.statusCode){
            res.status(loginRes.statusCode)
            res.send(loginRes)
        }
        res.json({
            token: jsonwebtoken.sign({ user: `IRL` }, jwtSecret)
        });
    }).catch(err=>{
        console.log(err)
        res.status(err.statusCode);
        res.send({data:err});
    })
})

/**
 * @swagger
 * /login:
 *   get:
 *     description: logs in and gets token as guest with limited functionality
 *     tags:
 *       - access
 *     produces:
 *       - application/json
 *     responses:
 *       201:
 *         description: got token
 *       500:
 *         description: Internal Server Error
 */
app.get('/login', async (req, res) => {
        res.json({
            token: jsonwebtoken.sign({ user: `guest` }, jwtSecret)
        })
})

if(process.env.ENV !== "development"){
app.use(jwt({ secret: jwtSecret, algorithms: ['HS256'] }));
}
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))


app.get('/', (req, res) =>{
    res.send("Hello World!");
})

app.use('/access', accessController)
app.use('/utils', utilsController)
app.use('/wco', webcheckoutController)
app.use('/database', dbController)

app.use(function(req, res){
    res.status(404);
});

function handleTimeout(){
    console.log("This is running every 5 minutes")
    getReservationsAndUpdateDB().then(r => {
        console.log("Successfully ran update res")
        console.log(r)
    }).catch(err=>{
        console.error(err)
    })
    iterateReservationsGive().then(res=>{
        betterLogging("iterate Give", "Give response",res)
    }).catch(err=>{
        betterLogging("iterate Give", "Give err",err)
    })
    iterateReservationsRevoke().then(res=>{
        betterLogging("iterate Revoke", "Revoke response",res)
    }).catch(err=>{
        betterLogging("iterate Revoke", "Revoke err",err)
    })

}


function restartSession(){
    startNewSession().then(r => {
        console.log(r)
    })
}

if(!process.env.SID) {
    restartSession()
}

setInterval(handleTimeout, 60000*5)
setInterval(restartSession, 60000*10)

module.exports = app;