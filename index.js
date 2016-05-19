var sourceMappingURL = require('source-map-url')

function InlineManifestPlugin(options) {}

InlineManifestPlugin.prototype.apply = function(compiler) {
    compiler.plugin('compilation', function(compilation){
        compilation.plugin('html-webpack-plugin-before-html-generation', function(htmlPluginData, callback) {
            var manifest;

            for(var key in compilation.assets){
                if(key.indexOf('manifest.') > -1){
                    // manifestSource will include the //# sourceMappingURL line if
                    // using sourcemaps so we need to remove
                    var manifestSource = compilation.assets[key].source()
                    var manifestSourceWithoutSourceMapUrl = sourceMappingURL.removeFrom(manifestSource)

                    manifest = manifestSourceWithoutSourceMapUrl;
                    break;
                }
            }

            htmlPluginData.assets && (htmlPluginData.assets.manifest = manifest);
            callback(null, htmlPluginData);
        });
    });
};

module.exports = InlineManifestPlugin;
