require('dotenv').config();
const express = require('express');
const app = express();
const port = 8080;
const Mongo = require('./mongo-connection');
const Redis = require('./redis-connection');
const router = require('./routes');
const bodyParser = require('body-parser');

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.json());

(async function startup() {
    Redis.init();
    await Mongo.init();
    router(app);

    app.listen(port, () => {
        console.log(`Listening at port ${port}`);
    });
})();