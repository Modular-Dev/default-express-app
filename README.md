[![Book session on Codementor](https://cdn.codementor.io/badges/book_session_github.svg)](https://www.codementor.io/fritzbatroni?utm_source=github&utm_medium=button&utm_term=fritzbatroni&utm_campaign=github)

# Modular-Dev/default-express-app
> Common express app settings

## Installation

```sh
$ npm install --save Modular-Dev/defaul-express-app
```
## Methodology
Uniformity with a focus on security is a good thing. Common settings across the board across all express apps. Period.

#### Use Helmet
Helmet can help protect your app from some well-known web vulnerabilities by setting HTTP headers appropriately.

Helmet is actually just a collection of nine smaller middleware functions that set security-related HTTP headers:

csp sets the Content-Security-Policy header to help prevent cross-site scripting attacks and other cross-site injections.
hidePoweredBy removes the X-Powered-By header.
hpkp Adds Public Key Pinning headers to prevent man-in-the-middle attacks with forged certificates.
hsts sets Strict-Transport-Security header that enforces secure (HTTP over SSL/TLS) connections to the server.
ieNoOpen sets X-Download-Options for IE8+.
noCache sets Cache-Control and Pragma headers to disable client-side caching.
noSniff sets X-Content-Type-Options to prevent browsers from MIME-sniffing a response away from the declared content-type.
frameguard sets the X-Frame-Options header to provide clickjacking protection.
xssFilter sets X-XSS-Protection to enable the Cross-site scripting (XSS) filter in most recent web browsers.


#### Use cookies securely
We use express cookie-session with encrypted data (cookie-encrypter)
* Don’t use the default session cookie name
* Set cookie security options
  * secure - Ensures the browser only sends the cookie over HTTPS.
  * httpOnly - Ensures the cookie is sent only over HTTP(S), not client JavaScript, helping to protect against cross-site scripting attacks.
  * domain - indicates the domain of the cookie; use it to compare against the domain of the server in which the URL is being requested. If they match, then check the path attribute next.
  * path - indicates the path of the cookie; use it to compare against the request path. If this and domain match, then send the cookie in the request.
  * expires - use to set expiration date for persistent cookies.

#### Ensure your dependencies are secure
Using npm to manage your application’s dependencies is powerful and convenient. But the packages that you use may contain critical security vulnerabilities that could also affect your application. The security of your app is only as strong as the “weakest link” in your dependencies.

Use either or both of the following two tools to help ensure the security of third-party packages that you use: nsp and Snyk.

nsp is a command-line tool that checks the Node Security Project vulnerability database to determine if your application uses packages with known vulnerabilities. 


## NPM Packages used

* express
* body-parser
* cookie-parser
* cookie-encrypter
* cookie-session
* errorhandler
* compression
* helmet



## Usage
 

```js
var config = {
    root: process.cwd(),
    port: 9090,
    cacheExpiry: 604800000,
    session: {
      secret: require('crypto').randomBytes(64).toString('hex'), // default
      signed: true, //default
      httpOnly: true, // default
      secure: true, // default
      expiration: new Date(Date.now() + 60 * 60 * 1000), // default 1 hour
      domain: 'localhost' //default
    },
    // optional - secure all endpoints via jwt
    // simply checks if there is a token passed in
    // then verifies based on shared secret [process.env.JWT_SECRET]
    jwt: {
      secureApiWithJwt: true,
      secureEndpoint: '/api'
    }
  };
var app = require('default-express-app')(config);
NOTE: returns express app
```


## License

MIT © [Fritz G. Batroni](https://fritzbatroni.wordpress.com/)