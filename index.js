'use strict';
var path = require('path');
var gutil = require('gulp-util');
var through = require('through2');
var parser = require('xml2json');
var SVGO = require('svgo');

module.exports = function (filename, opts) {
    opts = opts || {};
    if (!filename) {
        throw new gutil.PluginError('gulp-svg-symbol-sprite', 'filename is required');
    }
    var svgo = new SVGO(opts);
    var symbols = [];
    var latestFile;

    return through.obj(function (file, enc, cb) {
        if (!file.isNull() && !file.stat.isDirectory()) {
            latestFile = file;

            var id = path.parse(file.path).name;
            var json;
            svgo.optimize(file.contents, function(result) {
                try {
                    json = JSON.parse(parser.toJson(result.data));
                } catch (err) {
                    cb(err);
                }

                var svg = json.svg || {};
                var viewbox = svg.viewbox || svg.viewBox;
                var svgpath = Array.isArray(svg.path) ? svg.path : [svg.path];
                var symbol = {
                    id: id,
                    viewbox: viewbox,
                    path: svgpath.map(function(p) {
                        return {d: p.d};
                    })
                };

                symbols.push(symbol);
                cb();
            });
        }

    }, function (cb) {
        var svgJson = {
            'svg': {
                height: 0,
                width: 0,
                style: 'position: absolute',
                xmlns: 'http://www.w3.org/2000/svg',
                'xmlns:xlink': 'http://www.w3.org/1999/xlink',
                symbol: symbols
            }
        }
        var data = parser.toXml(svgJson);
        this.push(new gutil.File({
            cwd: latestFile.cwd,
            base: latestFile.base,
            path: path.join(latestFile.base, filename),
            contents: Buffer.from(data)
        }));
        cb();
    });

};