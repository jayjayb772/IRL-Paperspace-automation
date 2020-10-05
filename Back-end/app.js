require('dotenv').config();
const express = require('express');
const app = express();
const ENV = process.env.ENV;
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const cors = require('cors')
const accessController = require("./src/main/controllers/paperspace/accessController/accessController");
const utilsController = require("./src/main/controllers/paperspace/utilsController");
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
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))


app.get('/', (req, res) =>{
    res.send("Hello World!");
})

app.use('/access', accessController)
app.use('/utils', utilsController)

module.exports = app;