const Posts = require('./modules/posts');

function init(app) {
    app.get('/', (req, res) => res.send('You should never have come here.'))

    app.get('/posts/mysql', Posts.getMysqlPosts);
    app.get('/posts/mongo', Posts.getMongoPosts);
    app.get('/posts/redis', Posts.getRedisPosts);

    app.post('/posts/mysql', Posts.insertMysqlPost);
    app.post('/posts/mongo', Posts.insertMongoPost);
    app.post('/posts/redis', Posts.insertRedisPost);
}

module.exports = init;