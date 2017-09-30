var request = require('supertest')
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.Should();
chai.use(chaiAsPromised);
const assert = chai.assert;

var expressConfig = require('../lib/index');
var defaultExpressConfigs = require('./fixtures/settings');
var options = Object.assign({root: process.cwd(),
appName: 'Test App'}, defaultExpressConfigs);

const app = expressConfig(options);
var server = null;

describe('express config testing - ', function() {
  describe('working tests - ', function() {
    beforeEach(function(done) {
      server = app.listen(app.get('port'), () => {
        console.log (`listening on port ${app.get('port')}`)
      })
      return done();
    });
    afterEach(function(done) {
      server.close();
      return done();
    });
    
    it('default route /diagnostic - mounted', () => {
      return request(server)
      .get('/diagnostic')
      .expect(200)
      .then((res) => {
        var statusMessage = res.body;
        assert.equal(statusMessage.status, 'up', 'status should be up')
      })
    })

  });
});
