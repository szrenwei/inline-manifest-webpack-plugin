var sourceMappingURL = require('source-map-url')

function InlineManifestPlugin(options) {
	this.options = extend({
		name: 'webpackManifest',
		separator: '-'
	}, options)
}

InlineManifestPlugin.prototype.apply = function(compiler) {
	var me = this

    compiler.plugin('compilation', function(compilation){
        compilation.plugin('html-webpack-plugin-before-html-generation', function(htmlPluginData, callback) {
            var webpackManifest,
				name = me.options.name
			// HtmlWebpackPlugin use the 'manifest' name as HTML5's app cache manifest
			// so we can't use the same name
			if(name === 'manifest')
				throw new Error('[InlineManifestWebpackPlugin]: name can\'t be "manifest", please change another')

            for(var key in compilation.assets){
                if(key.indexOf('manifest' + me.options.separator) > -1){
					// remove sourceMap url if exist
					webpackManifest = sourceMappingURL.removeFrom(compilation.assets[key].source())
                    break
                }
            }

            htmlPluginData.assets && (htmlPluginData.assets[name] = webpackManifest)
            callback(null, htmlPluginData)
        })
    })
}

function extend(base){
	var i = 1,
		len = arguments.length

	for( ;i < len; i++){
		var obj = arguments[i]
		for(var key in obj){
			if(obj.hasOwnProperty(key)){
				base[key] = obj[key]
			}
		}
	}

	return base
}

module.exports = InlineManifestPlugin
