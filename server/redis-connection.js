const redis = require("redis");
const {
    HOST,
    REDIS_PASS
} = process.env;

let client;

function init() {
    client = redis.createClient({
        host: HOST,
        password: REDIS_PASS
    });
}

function getItem(key, field) {
    return new Promise((resolve, reject) => {
        client.hget(key, field, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
}

function getAll(key) {
    return new Promise((resolve, reject) => {
        client.hgetall(key, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    })
}

function setItem(key, field, value) {
    return new Promise((resolve, reject) => {
        client.hset(key, field, value, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
}

module.exports = {
    init,
    getItem,
    getAll,
    setItem
}