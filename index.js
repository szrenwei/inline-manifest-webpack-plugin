const sourceMappingURL = require('source-map-url')
const HtmlWebpackPlugin = require('html-webpack-plugin');

class InlineManifestWebpackPlugin {
    constructor(name) {
        this.name = name || 'runtime';
    }

    apply(compiler) {
        const name = this.name;

        compiler.hooks.emit.tap('InlineManifestWebpackPlugin', compilation => {
            // get asset name without extension
            const chunkName = getAssetName(compilation.chunks, name)
                .split('.')
                .slice(0, -1)
                .join('.');

            // exclude it from the emitted assets
            Object.keys(compilation.assets).map(key => {
                // simple comparison not enough here
                // because it can emit the file itself and sourcemap for it
                if (key.includes(chunkName)) delete compilation.assets[key];
            });
        });

        compiler.hooks.compilation.tap(
            'InlineManifestWebpackPlugin',
            compilation => {
                const hooks = HtmlWebpackPlugin.getHooks(compilation);

                hooks.alterAssetTagGroups.tapAsync(
                    'InlineManifestWebpackPlugin',
                    function (data, cb) {
                        const manifestAssetName = getAssetName(compilation.chunks, name);

                        if (manifestAssetName) {
                            data.headTags = inlineWhenMatched(
                                compilation,
                                data.headTags,
                                manifestAssetName
                            );

                            data.bodyTags = inlineWhenMatched(
                                compilation,
                                data.bodyTags,
                                manifestAssetName
                            );
                        }

                        cb(null, data);
                    }
                );

                hooks.beforeAssetTagGeneration.tapAsync(
                    'InlineManifestWebpackPlugin',
                    function (htmlPluginData, cb) {
                        const runtime = [];
                        const assets = htmlPluginData.assets;
                        const manifestAssetName = getAssetName(compilation.chunks, name);

                        if (
                            manifestAssetName &&
                            htmlPluginData.plugin.options.inject === false
                        ) {
                            runtime.push('<script>');
                            runtime.push(
                                sourceMappingURL.removeFrom(
                                    compilation.assets[manifestAssetName].source()
                                )
                            );
                            runtime.push('</script>');

                            const runtimeIndex = assets.js.indexOf(
                                assets.publicPath + manifestAssetName
                            );
                            if (runtimeIndex >= 0) {
                                assets.js.splice(runtimeIndex, 1);
                                delete assets.chunks[name];
                            }
                        }

                        assets.runtime = runtime.join('');
                        cb(null, htmlPluginData);
                    }
                );
            }
        );
    }
}

function getAssetName(chunks, chunkName) {
    return (chunks.filter(({ name }) => name === chunkName)[0] || { files: [] }).files[0];
}

function inlineWhenMatched(compilation, scripts, manifestAssetName) {
    return scripts.map(function (script) {
        const isManifestScript =
            script.tagName === 'script' &&
            script.attributes.src.indexOf(manifestAssetName) >= 0;

        if (isManifestScript) {
            return {
                tagName: 'script',
                closeTag: true,
                attributes: {
                    type: 'text/javascript',
                },
                innerHTML: sourceMappingURL.removeFrom(
                    compilation.assets[manifestAssetName].source()
                ),
            };
        }

        return script;
    });
}

module.exports = InlineManifestWebpackPlugin
