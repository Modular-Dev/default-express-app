devMode = process.env.NODE_ENV == 'development'
cluster = require 'cluster'
os      = require 'os'
express = require 'express'
path    = require 'path'
logger  = require('mod-dev-logger')({logId: 'default-express-app'})
serverStatus = require './server-status'

# middleware
cookieParser    = require 'cookie-parser'
cookieEncrypter = require 'cookie-encrypter'
cookieSession   = require 'cookie-session'
bodyParser      = require 'body-parser'
compression     = require 'compression'
crossDomain     = require './middleware/cross-domain'
helmet          = require 'helmet'

configureApp = (app, options) ->
  app.set 'root', options?.root
  app.set 'port', options?.port
  app.set 'cacheExpiry', options?.cacheExpiry
  app.set 'trust proxy', 1
  app.set 'appName', options?.appName or 'express app'
  app.set 'env', process.env.NODE_ENV or 'development'

  # express session
  cookieSessionConfig =
    secret: options?.session?.secret
    signed: options?.session?.signed
    httpOnly: options?.session?.httpOnly
    secure: options?.session?.secure
    name: "session - #{app.get('appName')}"
    keys: options?.session?.keys
    expires: options?.session?.expiration
    domain: options?.session?.domain
  app.use cookieSession(cookieSessionConfig)

  # server side views
  if options?.views?.enable
    viewFolder = options?.views?.folder or 'views'
    # default to ejs templating engine
    app.engine 'html', require('ejs').renderFile
    app.set 'view engine', 'html'
    app.set 'views', path.join( app.get('root'), viewFolder )
    app.set 'view cache', false unless options?.views?.cache

  
  # apply middleware
  app.use bodyParser.urlencoded(extended: true)
  app.use bodyParser.json()
  app.use bodyParser.raw(limit: '100mb')
  app.use cookieParser(options?.session?.secret)
  app.use cookieEncrypter(options?.session?.secret)
  app.use compression({ threshold: false})
  app.use crossDomain
  app.use(helmet())

  # configure some default routes
  maxAge = if devMode then 0 else app.get('cacheExpiry')

  # default diagnostic route
  app.use('/diagnostic', serverStatus(app))

  # server static content
  if options?.static
    staticFolder = options?.static?.folder or 'client'
    localStatic = path.resolve(app.get('root'), staticFolder)
    app.use '/', express.static localStatic, { maxAge: maxAge }

  # local dev settings
  if app.get 'env'  == 'development'
    app.locals.pretty = true

  return app

module.exports = (options={}) ->
  # initialize the express app and configure via options
  app = express()

  # production optimization - fork off child processes if master
  forks = parseInt process.env.FORKS or require('os').cpus().length
  if cluster.isMaster and not devMode
    logger.debug "Initializing #{forks} worker processes"
    cluster.fork() for [1..forks]
    cluster.on 'online', (worker) ->
      logger.debug 'Worker ' + worker.process.pid + ' is online'
    cluster.on 'exit', (worker,code,signal) ->
      logger.debug "Worker #{worker.process.pid} died", code, signal
      # replace the dead worker
      cluster.fork()
  else
    configureApp(app, options)

    
