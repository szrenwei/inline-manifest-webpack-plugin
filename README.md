[![CircleCI](https://circleci.com/gh/szrenwei/inline-manifest-webpack-plugin/tree/master.svg?style=shield)](https://circleci.com/gh/szrenwei/inline-manifest-webpack-plugin/tree/master) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com) [![npm](https://img.shields.io/npm/dt/inline-manifest-webpack-plugin.svg)](https://www.npmjs.com/package/inline-manifest-webpack-plugin)  [![npm](https://img.shields.io/npm/v/inline-manifest-webpack-plugin.svg)](https://www.npmjs.com/package/inline-manifest-webpack-plugin) [![npm](https://img.shields.io/npm/l/inline-manifest-webpack-plugin.svg)](https://www.npmjs.com/package/inline-manifest-webpack-plugin)

Inline Manifest Webpack Plugin
===================

This is a [webpack](http://webpack.github.io/) plugin that inline your manifest.js with a script tag to save http request. Cause webpack's runtime always change between every build, it's better to split the runtime code out for long-term caching.


Installation
------------
Install the plugin with npm:
```shell
$ npm i inline-manifest-webpack-plugin -D
```

Basic Usage
-----------

This plugin need to work with [HtmlWebpackPlugin](https://www.npmjs.com/package/html-webpack-plugin) v2.10.0 and above:

__Step1__: split out the runtime code
```javascript
// for explicit vendor chunk config
[
	new webpack.optimize.CommonsChunkPlugin({
		names: ['vendor', 'manifest']
	})
]

// or specify which chunk to split manually
[
	new webpack.optimize.CommonsChunkPlugin({
		name: 'manifest',
        chunks: ['...']
	})
]
```
__Step2__: config HtmlWebpackPlugin:
```javascript
[
	new HtmlWebpackPlugin({
		template: './index.ejs'
	})
]
```

__Step3__: config InlineManifestWebpackPlugin
* __name__: default value is `webpackManifest`,  result in `htmlWebpackPlugin.files[name]`, you can specify any other name __except__ `manifest`, beacuse the name `manifest` haved been used by HtmlWebpackPlugin for H5 app cache manifest.
```javascript
[
	new InlineManifestWebpackPlugin({
		name: 'webpackManifest'
	})
]
```

```html
<!-- index.ejs -->
<!doctype html>
<html>
<head>
	<meta charset="UTF-8">
	<title>App</title>
</head>
<body>


<%=htmlWebpackPlugin.files.webpackManifest%>

</body>
</html>
```
__Done!__
