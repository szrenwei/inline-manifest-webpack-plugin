const sourceMappingURL = require('source-map-url');

function InlineManifestPlugin(options) {
    this.options = extend({
        name: 'webpackManifest'
    }, options || {})
}

InlineManifestPlugin.prototype.apply = function (compiler) {
    const me = this;

    compiler.plugin('compilation', function (compilation) {
        compilation.plugin('html-webpack-plugin-before-html-generation', function (htmlPluginData, callback) {
            const name = me.options.name;
            // HtmlWebpackPlugin use the 'manifest' name as HTML5's app cache manifest
            // so we can't use the same name
            if (name === 'manifest') {
                throw new Error('[WebpackInlineManifestPlugin]: name can\'t be "manifest".')
            }

            const webpackManifest = [];
            const assets = htmlPluginData.assets;
            const manifestPath = (compilation.chunks.filter(function (chunk) {
                return chunk.name === 'manifest'
            })[0] || {files: []}).files[0];

            if (manifestPath) {
                webpackManifest.push('<script>');
                webpackManifest.push(sourceMappingURL.removeFrom(compilation.assets[manifestPath].source()));
                webpackManifest.push('</script>');

                const manifestIndex = assets.js.indexOf(assets.publicPath + manifestPath);
                if (manifestIndex >= 0) {
                    assets.js.splice(manifestIndex, 1);
                    delete assets.chunks.manifest
                }
            }

            assets[name] = webpackManifest.join('');
            if (callback) {
                callback(null, htmlPluginData)
            }
        })
    })
};

function extend(base) {
    const len = arguments.length;

    for (let i = 1; i < len; i++) {
        const obj = arguments[i];
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                base[key] = obj[key]
            }
        }
    }

    return base
}

module.exports = InlineManifestPlugin;
