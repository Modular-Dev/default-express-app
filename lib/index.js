(function() {
  var bodyParser, cluster, compression, configureApp, cookieEncrypter, cookieParser, cookieSession, crossDomain, devMode, express, helmet, logger, os, path, serverStatus;

  devMode = process.env.NODE_ENV === 'development';

  cluster = require('cluster');

  os = require('os');

  express = require('express');

  path = require('path');

  logger = require('mod-dev-logger')({
    logId: 'default-express-app'
  });

  serverStatus = require('./server-status');

  cookieParser = require('cookie-parser');

  cookieEncrypter = require('cookie-encrypter');

  cookieSession = require('cookie-session');

  bodyParser = require('body-parser');

  compression = require('compression');

  crossDomain = require('./middleware/cross-domain');

  helmet = require('helmet');

  configureApp = function(app, options) {
    var cookieSessionConfig, localStatic, maxAge, ref, ref1, ref10, ref11, ref12, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, staticFolder, viewFolder;
    app.set('root', options != null ? options.root : void 0);
    app.set('port', options != null ? options.port : void 0);
    app.set('cacheExpiry', options != null ? options.cacheExpiry : void 0);
    app.set('trust proxy', 1);
    app.set('appName', (options != null ? options.appName : void 0) || 'express app');
    app.set('env', process.env.NODE_ENV || 'development');
    cookieSessionConfig = {
      secret: options != null ? (ref = options.session) != null ? ref.secret : void 0 : void 0,
      signed: options != null ? (ref1 = options.session) != null ? ref1.signed : void 0 : void 0,
      httpOnly: options != null ? (ref2 = options.session) != null ? ref2.httpOnly : void 0 : void 0,
      secure: options != null ? (ref3 = options.session) != null ? ref3.secure : void 0 : void 0,
      name: "session - " + (app.get('appName')),
      keys: options != null ? (ref4 = options.session) != null ? ref4.keys : void 0 : void 0,
      expires: options != null ? (ref5 = options.session) != null ? ref5.expiration : void 0 : void 0,
      domain: options != null ? (ref6 = options.session) != null ? ref6.domain : void 0 : void 0
    };
    app.use(cookieSession(cookieSessionConfig));
    if (options != null ? (ref7 = options.views) != null ? ref7.enable : void 0 : void 0) {
      viewFolder = (options != null ? (ref8 = options.views) != null ? ref8.folder : void 0 : void 0) || 'views';
      app.engine('html', require('ejs').renderFile);
      app.set('view engine', 'html');
      app.set('views', path.join(app.get('root'), viewFolder));
      if (!(options != null ? (ref9 = options.views) != null ? ref9.cache : void 0 : void 0)) {
        app.set('view cache', false);
      }
    }
    app.use(bodyParser.urlencoded({
      extended: true
    }));
    app.use(bodyParser.json());
    app.use(bodyParser.raw({
      limit: '100mb'
    }));
    app.use(cookieParser(options != null ? (ref10 = options.session) != null ? ref10.secret : void 0 : void 0));
    app.use(cookieEncrypter(options != null ? (ref11 = options.session) != null ? ref11.secret : void 0 : void 0));
    app.use(compression({
      threshold: false
    }));
    app.use(crossDomain);
    app.use(helmet());
    maxAge = devMode ? 0 : app.get('cacheExpiry');
    app.use('/diagnostic', serverStatus(app));
    if (options != null ? options["static"] : void 0) {
      staticFolder = (options != null ? (ref12 = options["static"]) != null ? ref12.folder : void 0 : void 0) || 'client';
      localStatic = path.resolve(app.get('root'), staticFolder);
      app.use('/', express["static"](localStatic, {
        maxAge: maxAge
      }));
    }
    if (app.get('env' === 'development')) {
      app.locals.pretty = true;
    }
    return app;
  };

  module.exports = function(options) {
    var app, forks, i, ref;
    if (options == null) {
      options = {};
    }
    app = express();
    forks = parseInt(process.env.FORKS || require('os').cpus().length);
    if (cluster.isMaster && !devMode) {
      logger.debug("Initializing " + forks + " worker processes");
      for (i = 1, ref = forks; 1 <= ref ? i <= ref : i >= ref; 1 <= ref ? i++ : i--) {
        cluster.fork();
      }
      cluster.on('online', function(worker) {
        return logger.debug('Worker ' + worker.process.pid + ' is online');
      });
      return cluster.on('exit', function(worker, code, signal) {
        logger.debug("Worker " + worker.process.pid + " died", code, signal);
        return cluster.fork();
      });
    } else {
      return configureApp(app, options);
    }
  };

}).call(this);
