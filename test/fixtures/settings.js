(function() {
  module.exports = {
    port: 3131,
    cacheExpiry: 604800000,
    session: {
      secret: require('crypto').randomBytes(64).toString('hex'),
      signed: true,
      httpOnly: true,
      secure: true,
      keys: [process.env.COOKIE_SESSION_SECRET_KEY],
      expiration: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      domain: process.env.NODE_ENV === 'production' ? ".madetoship.com" : 'localhost'
    },
    jwt: {
      secureApiWithJwt: true,
      secureEndpoint: '/api'
    }
  };
}).call(this);