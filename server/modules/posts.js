const mysql = require('../mysql-connection');
const mongo = require('../mongo-connection');
const redis = require('../redis-connection');

async function getMysqlPosts(req, res) {
    try {
        const query = `
            SELECT 
                *
            FROM
                posts
            ORDER BY created DESC
        `;

        const posts = await mysql.query(query);
        res.send(posts);
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
}

async function getMongoPosts(req, res) {
    try {
        const posts = await mongo.find('posts', {});
        res.send(posts);
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
}

async function getRedisPosts(req, res) {
    try {
        const posts = await redis.getAll('posts');
        const cleanedPosts = Object.values(posts).map(post => {
            try {
                return JSON.parse(post);
            } catch (e) {
                return "Invalid JSON"
            }
        });
        res.send(cleanedPosts ? cleanedPosts : []);
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
}

function makeMysqlError(data) {
    return `INCORRECT PARAMETERS. 
                
required: 
{
    title: "Some String",
    body: "Some String",
    user: "Someone's Name"
}

received:
${JSON.stringify(data, undefined, 4)}
`;
}

async function insertMysqlPost(req, res) {
    try {
        /**
         * 
         * Big Note:
         * 
         * This is BAD in a real world scenario.
         * Under no circumstances just insert data provided by
         * users with no sanitization, authorization, or checking that
         * the parameters are correct. This is designed to 
         * allow for errors and failure as a learning tool.
         * Never, ever, ever, ever, ever just insert data this way.
         * 
         */
        const query = `
            INSERT INTO 
                posts
            SET ?
        `;

        try {
            const result = await mysql.query(query, req.body);
            console.log(result);
            res.send({ id: result.insertId });
        } catch (e) {
            res.status(400).send({
                error: makeMysqlError(req.body),
                exact_mysql_error: JSON.stringify(e, undefined, 4)
            });
        }
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
}

async function insertMongoPost(req, res) {
    try {
        /**
         * 
         * Like above, this is might be VALID 
         * but it is completely bananas. You want to know who
         * is putting this data into your database, you want to ensure
         * they have the rights to do this, and you want to make
         * certain that they're not just dumping garbage into your
         * collection.
         * 
         */
        console.log(req.body);
        const result = mongo.insert('posts', req.body);
        console.log(result);
        res.send({ id: result._id });
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
}

async function insertRedisPost(req, res) {
    try {
        /**
         * 
         * This is a little more subjective. Again, never allow
         * unverified users to drop stuff in your database, but also
         * don't just let users come up with the keys themselves. Just
         * putting this in to show what can go wrong. Will two people
         * pick the same title and overwrite the posts? Who knows.
         * 
         */
        const result = redis.setItem('posts', req.body.key, JSON.stringify(req.body.value));
        console.log(result);
        res.send(result);
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
}

module.exports = {
    getMysqlPosts,
    getMongoPosts,
    getRedisPosts,
    insertMysqlPost,
    insertMongoPost,
    insertRedisPost
}