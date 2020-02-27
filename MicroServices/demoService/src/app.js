'use strict';

const config = require('./config/config');
const logger = require('./helpers/logger');
const express = require('express');
const request = require('request-promise');

const app = express();

app.get('/', async(req, res) => {
    logger.info('OK');
    res.status(200).json('OK');
});

app.get('/compute', async(req, res) => {
    const num = Number(req.query.num) || 35;
    let result;

    const options = {
        uri: `${config.targetHost}:${config.targetPort}/compute?num=${num}`,
        body: {
            some: 'payload'
        },
        json: true
    };

    try {
        logger.info(`start computing ficonnaci of ${num}`);
        result = fibonacci(num);

        if (config.nonLeaf) {
            const response = request(options);
            result = response.body;
        }

        logger.info(`fibonacci number of ${num} is ${result}`);
        res.status(200).json(`fibonacci number of ${num} is ${result}`);
    } catch (e) {
        logger.error(e.message);
        res.status(500).json(e.stack);
    }
});

const fibonacci = (num) => {
    if (num <= 1) {
        return num;
    }

    return fibonacci(num - 2) + fibonacci(num - 1);
};


// run server
app.listen(config.port, () => {
    logger.info(`Server running on ${config.port}:${config.host}`);
});

