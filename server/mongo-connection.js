const MongoClient = require('mongodb').MongoClient;

const {
    HOST,
    MONGO_USER,
    MONGO_PASS
} = process.env;

const url = `mongodb://${MONGO_USER}:${MONGO_PASS}@${HOST}:27017`;

const dbName = "teaching";

let db;

function init() {
    return new Promise((resolve, reject) => {
        MongoClient.connect(url, (err, client) => {
            if (err) reject(err);
            else {
                db = client.db(dbName);
                resolve();
            }
        });
    });
}

function insert(collectionName, data) {
    return new Promise((resolve, reject) => {
        const collection = db.collection(collectionName);
        collection.insertOne(data, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
}

function findOne(collectionName, conditions) {
    return new Promise((resolve, reject) => {
        const collection = db.collection(collectionName);
        collection.findOne(conditions, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        })
    })
}

function find(collectionName, conditions) {
    return new Promise((resolve, reject) => {
        const collection = db.collection(collectionName);
        collection.find(conditions).toArray((err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
}

module.exports = {
    init,
    insert,
    findOne,
    find
}