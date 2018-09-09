var sourceMappingURL = require('source-map-url')

function InlineManifestWebpackPlugin (name) {
    this.name = name || 'runtime'
}

InlineManifestWebpackPlugin.prototype.apply = function (compiler) {
    var name = this.name

    compiler.hooks.emit
        .tap('InlineManifestWebpackPlugin', function (compilation) {
            delete compilation.assets[getAssetName(compilation.chunks, name)]
        })

    compiler.hooks.compilation
        .tap('InlineManifestWebpackPlugin', function (compilation) {
            compilation.hooks.htmlWebpackPluginAlterAssetTags
                .tapAsync('InlineManifestWebpackPlugin', function (data, cb) {
                    var manifestAssetName = getAssetName(compilation.chunks, name)

                    if (manifestAssetName) {
                        ['head', 'body'].forEach(function (section) {
                            data[section] = inlineWhenMatched(
                                compilation,
                                data[section],
                                manifestAssetName
                            )
                        })
                    }

                    cb(null, data)
                })

            compilation.hooks.htmlWebpackPluginBeforeHtmlGeneration
                .tapAsync('InlineManifestWebpackPlugin', function (htmlPluginData, cb) {
                    var runtime = []
                    var assets = htmlPluginData.assets
                    var manifestAssetName = getAssetName(compilation.chunks, name)

                    if (manifestAssetName && htmlPluginData.plugin.options.inject === false) {
                        runtime.push('<script>')
                        runtime.push(sourceMappingURL.removeFrom(compilation.assets[manifestAssetName].source()))
                        runtime.push('</script>')

                        var runtimeIndex = assets.js.indexOf(assets.publicPath + manifestAssetName)
                        if (runtimeIndex >= 0) {
                            assets.js.splice(runtimeIndex, 1)
                            delete assets.chunks[name]
                        }
                    }

                    assets.runtime = runtime.join('')
                    cb(null, htmlPluginData)
                })
        })
}

function getAssetName (chunks, chunkName) {
    return (chunks.filter(function (chunk) {
        return chunk.name === chunkName
    })[0] || {files: []}).files[0]
}

function inlineWhenMatched (compilation, scripts, manifestAssetName) {
    return scripts.map(function (script) {
        var isManifestScript = script.tagName === 'script' &&
              (script.attributes.src.indexOf(manifestAssetName) >= 0)

        if (isManifestScript) {
            return {
                tagName: 'script',
                closeTag: true,
                attributes: {
                    type: 'text/javascript'
                },
                innerHTML: sourceMappingURL.removeFrom(compilation.assets[manifestAssetName].source())
            }
        }

        return script
    })
}

module.exports = InlineManifestWebpackPlugin
