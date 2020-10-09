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
const swagOptions = {
    definition: {
        openapi: '3.0.0', // Specification (optional, defaults to swagger: '2.0')
        info: {
            title: 'IRL Paperspace control API', // Title (required)
            version: '1.0.0', // Version (required)
        },
    },
    // Path to the API docs
    apis: ['./src/main/controllers/*/*.js', './*.js', './src/main/controllers/paperspace/utilsController/*.js', './src/main/controllers/paperspace/accessController/*.js'],
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
 *     requestBody:
 *      description: Optional description in *Markdown*
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
    loginToSite(req.body).then(loginRes=>{
        res.json({
            token: jsonwebtoken.sign({ user: `IRL` }, jwtSecret)
        });
    }).catch(err=>{
        res.status(err.statusCode);
        res.send(err);
    })
})

app.use(jwt({ secret: jwtSecret, algorithms: ['HS256'] }));

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

module.exports = app;