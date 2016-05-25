var sourceMappingURL = require('source-map-url')

function InlineManifestPlugin (options) {
    this.options = extend({
        name: 'webpackManifest'
    }, options || {})
}

InlineManifestPlugin.prototype.apply = function (compiler) {
    var me = this

    compiler.plugin('compilation', function (compilation) {
        compilation.plugin('html-webpack-plugin-before-html-generation', function (htmlPluginData, callback) {
            var name = me.options.name
            // HtmlWebpackPlugin use the 'manifest' name as HTML5's app cache manifest
            // so we can't use the same name
            if (name === 'manifest') {
                throw new Error('[InlineManifestWebpackPlugin]: name can\'t be "manifest".')
            }

            var webpackManifest = []
            var assets = htmlPluginData.assets
            var manifestPath = (compilation.chunks.filter(function (chunk) {
                return chunk.name === 'manifest'
            })[0] || {files: []}).files[0]

            if (manifestPath) {
                webpackManifest.push('<script>')
                webpackManifest.push(sourceMappingURL.removeFrom(compilation.assets[manifestPath].source()))
                webpackManifest.push('</script>')

                var manifestIndex = assets.js.indexOf(assets.publicPath + manifestPath)
                if (manifestIndex >= 0) {
                    assets.js.splice(manifestIndex, 1)
                    delete assets.chunks.manifest
                }
            }

            assets[name] = webpackManifest.join('')
            callback(null, htmlPluginData)
        })
    })
}

function extend (base) {
    var i = 1
    var len = arguments.length

    for (; i < len; i++) {
        var obj = arguments[i]
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                base[key] = obj[key]
            }
        }
    }

    return base
}

module.exports = InlineManifestPlugin
