# disable logs while running tests to not clutter console
export LOG_LEVEL=OFF
export NODE_ENV=development
export COOKIE_SESSION_SECRET_KEY=12345
gulp && mocha