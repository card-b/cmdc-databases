const Posts = require('./modules/posts');

function init(app) {
    app.get('/api', (req, res) => res.send('You should never have come here.'))

    app.get('/api/posts/mysql', Posts.getMysqlPosts);
    app.get('/api/posts/mongo', Posts.getMongoPosts);
    app.get('/api/posts/redis', Posts.getRedisPosts);

    app.post('/api/posts/mysql', Posts.insertMysqlPost);
    app.post('/api/posts/mongo', Posts.insertMongoPost);
    app.post('/api/posts/redis', Posts.insertRedisPost);
}

module.exports = init;