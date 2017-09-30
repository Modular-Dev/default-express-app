(function() {
  var moment, revision, startTime;

  moment = require('moment');

  startTime = new Date().getTime();

  revision = require('child_process').execSync('git rev-parse --short HEAD').toString().trim();

  module.exports = function(app) {
    return function(req, res, next) {
      var status, uptime;
      uptime = new Date(new Date().getTime() - startTime).toUTCString().split(" ")[4];
      status = {
        status: 'up',
        startedOn: moment(startTime),
        uptime: moment(startTime).fromNow(),
        lastDeployed: uptime,
        git: revision
      };
      return res.send(status);
    };
  };

}).call(this);
