function InlineManifestPlugin(options) {}

InlineManifestPlugin.prototype.apply = function(compiler) {
    compiler.plugin('compilation', function(compilation){
        compilation.plugin('html-webpack-plugin-before-html-generation', function(htmlPluginData, callback) {
            var manifest;

            for(var key in compilation.assets){
                if(key.indexOf('manifest.') > -1){
                    manifest = compilation.assets[key].source();
                    break;
                }
            }

            htmlPluginData.assets && (htmlPluginData.assets.manifest = manifest);
            callback(null, htmlPluginData);
        });
    });
};

module.exports = InlineManifestPlugin;
