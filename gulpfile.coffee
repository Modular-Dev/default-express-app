'use strict'
path      = require 'path'
gulp      = require 'gulp'
nsp       = require 'gulp-nsp'
coffee    = require 'gulp-coffee'
cache     = require 'gulp-cached'
gutil     = require 'gulp-util'
del       = require 'del'
coffeelint = require 'gulp-coffeelint'

gulp.task 'nsp', (cb) ->
  nsp { package: path.resolve('package.json') }, cb
  return

gulp.task 'clean', (done)->
  del ['lib'], done

gulp.task 'coffeelint', ['clean'], ->
  gulp.src 'src/**/*.coffee'
  .pipe cache( 'js' )
  .pipe coffeelint()
  .pipe(coffeelint.reporter())
  .pipe(coffeelint.reporter('fail'))
  .pipe gutil.noop()

gulp.task 'compile', ['coffeelint'], ->
  gulp.src(['src/**/*.coffee'])
  .pipe coffee()
  .pipe gulp.dest 'lib'

gulp.task 'prepublish', [ 'nsp' ]
gulp.task 'default', [ 'compile']