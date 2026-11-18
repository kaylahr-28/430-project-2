const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
    app.get('/getPosts', mid.requiresLogin, controllers.Post.getPosts);
    app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
    app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

    app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

    app.get('/logout', mid.requiresLogin, controllers.Account.logout);

    app.get('/maker', mid.requiresLogin, controllers.Post.makerPage);
    app.post('/maker', mid.requiresLogin, controllers.Post.makePost);

    app.get('/users', mid.requiresLogin, controllers.Account.moreUsersPage);
    app.get('/getUsers', mid.requiresLogin, controllers.Account.getUsers)

    app.get('/feed', mid.requiresLogin, controllers.Account.feedPage);
    app.get('/getFeed', mid.requiresLogin, controllers.Account.getFeed);



    app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;