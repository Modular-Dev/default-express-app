moment    = require 'moment'
startTime = new Date().getTime()

# get git commit sha
revision = require('child_process')
  .execSync('git rev-parse --short HEAD')
  .toString().trim()

module.exports = (app) ->
  (req, res, next) ->
    uptime = new Date(new Date().getTime() - startTime).toUTCString().split(" ")[4]
    status =
      status: 'up'
      startedOn: moment(startTime)
      uptime: moment(startTime).fromNow()
      lastDeployed: uptime
      git: revision

    res.send(status)