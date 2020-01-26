#[gulp](https://github.com/gulpjs/gulp)-json-to-yml

> A [Gulp](https://github.com/gulpjs/gulp) plugin to convert [JSON](http://en.wikipedia.org/wiki/JSON) to[YAML](http://en.wikipedia.org/wiki/YAML) using [js-yaml](https://github.com/nodeca/js-yaml).

This fixes the security issues with gulp-json-to-yaml, that relied on gulp-util (by kicking out gulp-util).
This could have been a pull request, if the original author would have found the time to build an actual repo, instead of just a pull request off of another repo.

Both original authors are still listed.


## Install

```sh
npm install --save-dev gulp-json-to-yml
```

## Usage

```js
var json2yml = require('gulp-json-to-yml');

gulp.src('./src/*.json')
  .pipe(json2yml())
  .pipe(gulp.dest('./dist/'))

gulp.src('./src/*.json')
  .pipe(json2yml({ safe: true}))
  .pipe(gulp.dest('./dist/'))

```


## API

### jsonToYaml([options])



#### options.safe

Type: `Boolean`

Default: `true`

Enable or disable support for regexps, functions and undefined.

**This flag should always be enabled when working with untrusted data.**

When this flag is enabled then [safeDump] method is used, otherwise [dump].
The options object is passed on to js-yaml methods.
See [js-yaml for details](https://github.com/nodeca/js-yaml)

#### options.filename

Type `String`

Default: the path of the file processed

String to be used as a file path in error/warning messages.


## License

MIT
