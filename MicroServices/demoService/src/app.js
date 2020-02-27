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
    let level = Number(req.query.level) || 0;
    let result;

    const options = {
        uri: `http://${config.targetHost}:${config.targetPort}/compute?num=${num}&level=${level + 1}`,
        body: {
            some: 'payload'
        },
        json: true
    };

    try {
        result = fibonacci(num);

        if (config.nonLeaf) {
            const response = await request(options);
            result = response.result;
            level = response.level;
        }

        logger.info(`num: ${num}, result: ${result}, level: ${level}`);
        res.status(200).json({num: num, result: result, level: level});
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

