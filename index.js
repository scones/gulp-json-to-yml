'use strict';

const through       = require('through2');
const replaceExt    = require('replace-ext');
const yaml          = require('js-yaml');
const xtend         = require('xtend');
const BufferStreams = require('bufferstreams');
const PluginError   = require('plugin-error');
const PLUGIN_NAME   = 'gulp-json-to-yml';


function json2yaml(buffer, options) {
  let contents = buffer.toString('utf8');
  let src = JSON.parse(contents);
  let ymlDocument = options.safe ? yaml.safeDump(src, options) : yaml.dump(src, options);
  return new Buffer(ymlDocument);
}

module.exports = function(options) {
  options = xtend({safe: true, replacer: null, space: null}, options);
  let providedFilename = options.filename;

  return through.obj(function(file, enc, callback) {
    if (!providedFilename) {
      options.filename = file.path;
    }

    if (file.isBuffer()) {
      if (file.contents.length === 0) {
        this.emit('error', new PluginError(PLUGIN_NAME, 'File ' + file.path +
            ' is empty. JSON loader cannot load empty content'));
        return callback();
      }
      try {
        file.contents = json2yaml(file.contents, options);
        file.path = replaceExt(file.path, '.yaml');
      }
      catch (error) {
        this.emit('error', new PluginError(PLUGIN_NAME, error, {showStack: true}));
        return callback();
      }
    }
    else if (file.isStream()) {
      let _this = this;
      let streamer = new BufferStreams(function(err, buf, cb) {
        if (err) {
          _this.emit('error', new PluginError(PLUGIN_NAME, err, {showStack: true}));
        }
        else {
          if (buf.length === 0) {
            _this.emit('error', new PluginError(PLUGIN_NAME, 'File ' + file.path +
                ' is empty. JSON loader cannot load empty content'));
          }
          else {
            try {
              let parsed = json2yaml(buf, options);
              file.path = replaceExt(file.path, '.yaml');
              cb(null, parsed);
            }
            catch (error) {
              _this.emit('error', new PluginError(PLUGIN_NAME, error, {showStack: true}));
            }
          }
        }
      });
      file.contents = file.contents.pipe(streamer);
    }
    this.push(file);
    callback();
  });
};
