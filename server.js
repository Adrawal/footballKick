const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const http = require('http');
const cookieParser = require('cookie-parser');
const validator = require('express-validator');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const flash = require('connect-flash');
const config = require('./config/config');
const passport = require('passport');


const container = require('./container');


container.resolve(function (users,lodash,admin) {
    mongoose.promise = global.Promise;
    //mongoose.connect('mongodb://localhost/footballkik',{useMongoClient:true})
    var dbURI = "mongodb://" + config.db.host + ":" + config.db.port +"/" + config.db.name;
    mongoose.connect(dbURI);
    const app = SetupExpress();

    function SetupExpress() {
        const app = express();
        const server = http.createServer(app);
        server.listen(3000, function () {
            console.log('listning on port 3000');
        });
        configureExpress(app);

        /** we are going to use promise express promise router */
        const router = require('express-promise-router')();
        users.setRouting(router);
        admin.setRouting(router);
        app.use(router);
    }

    function configureExpress(app) {
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({
            extended: true
        }));
        require('./passport/passport-local');
        require('./passport/passport-facebook');
        require('./passport/passport-google');
        // all static file will be able to render
        app.use(express.static('public'));
        app.use(cookieParser());
        app.set('view engine', 'ejs');
       

        app.use(validator());
        app.use(session({
            secret: 'Secret@32',
            resave: true,
            saveUninitialized: true,
            store: new MongoStore({
                mongooseConnection: mongoose.connection
            })
        }))
        app.use(flash());
        app.use(passport.initialize());
        app.use(passport.session());
        app.locals.lodash = lodash;


    }
});