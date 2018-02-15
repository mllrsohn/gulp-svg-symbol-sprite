'use strict';
var path = require('path');
var gutil = require('gulp-util');
var through = require('through2');
var SVGO = require('svgo');
var svgParser = require('svg-parser');
var jsontoxml = require('jsontoxml');

var mapChild = function(child) {
    var mappedChild = { name: child.name, attrs: child.attributes };
    if (child.children && child.children.length > 0) {
        mappedChild.children = child.children.map(mapChild);
    }
    return mappedChild;
};

module.exports = function(output, opts) {
    var filename;
    var jsonFileName;
    opts = opts || {
        plugins: [ {removeViewBox: false, removeAttrs: { attrs: 'fill' } } ]
    };

    if (typeof output === 'String') {
        filename = output;
    } else {
        filename = output.svg;
        jsonFileName = output.json;
    }

    if (!filename) {
        throw new gutil.PluginError('gulp-svg-symbol-sprite', 'filename is required');
    }

    var svgo = new SVGO(opts);
    var symbols = [];
    var latestFile;

    return through.obj(
        function(file, enc, cb) {
            if (!file.isNull() && !file.stat.isDirectory()) {
                latestFile = file;

                var id = path.parse(file.path).name;
                var json;
                svgo.optimize(file.contents).then(function(result) {
                    try {
                        json = svgParser.parse(result.data);
                    } catch (err) {
                        gutil.log(gutil.colors.red('gulp-svg-symbol-sprite'), 'Skipped file: ' + path.parse(file.path).base, 'could not parse file');
                        return cb();
                    }

                    var symbol = {
                        name: 'symbol',
                        attrs: {
                            id: id,
                            viewbox: json.attributes.viewbox || json.attributes.viewBox
                        },
                        children: json.children.map(mapChild)
                    };
                    symbols.push(symbol);
                    cb();
                });
            }
        },
        function(cb) {
            var data = '<svg height="0" style="position: absolute" width="0" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' + jsontoxml(symbols) + '</svg>';
            if (jsonFileName) {
                this.push(
                    new gutil.File({
                        cwd: latestFile.cwd,
                        base: latestFile.base,
                        path: path.join(latestFile.base, jsonFileName),
                        contents: Buffer.from(JSON.stringify(symbols))
                    })
                );
            }

            this.push(
                new gutil.File({
                    cwd: latestFile.cwd,
                    base: latestFile.base,
                    path: path.join(latestFile.base, filename),
                    contents: Buffer.from(data)
                })
            );
            cb();
        }
    );
};