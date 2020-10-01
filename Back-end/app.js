require('dotenv').config();
const express = require('express');
const app = express();
const ENV = process.env.ENV;
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const cors = require('cors')
const paperspaceController = require("./src/main/controllers/paperspaceController/paperspaceController");
const swagoptions = {
    definition: {
        openapi: '3.0.0', // Specification (optional, defaults to swagger: '2.0')
        info: {
            title: 'Messaging Service', // Title (required)
            version: '1.0.0', // Version (required)
        },
    },
    // Path to the API docs
    apis: ['./src/main/controllers/*/*.js', './*.js', './src/main/controllers/paperspaceController/*.js'],
};
const swaggerSpec = swaggerJSDoc(swagoptions);

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

/**
 * @swagger
 *
 * /:
 *   get:
 *     description: base url
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: login
 */
app.get('/', (req, res) =>{
    res.send("Hello World!");
})


app.use('/paperspace', paperspaceController)

module.exports = app;