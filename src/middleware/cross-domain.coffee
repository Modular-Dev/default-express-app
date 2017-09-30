module.exports = (req, res, next) ->
  res.header('Access-Control-Allow-Origin', req.headers.origin)
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type,X-Requested-With, Authorization')
  res.header('Access-Control-Allow-Credentials', 'true')

  next()
