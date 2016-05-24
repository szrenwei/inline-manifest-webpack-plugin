[![CircleCI](https://circleci.com/gh/szrenwei/inline-manifest-webpack-plugin/tree/master.svg?style=shield)](https://circleci.com/gh/szrenwei/inline-manifest-webpack-plugin/tree/master)

Inline Manifest Webpack Plugin
===================

This is a [webpack](http://webpack.github.io/) plugin that inline your manifest.js with a script tag to save http request. Cause webpack's runtime always change between every build, it's better to separate the runtime code out for long-term caching.


Installation
------------
Install the plugin with npm:
```shell
$ npm install inline-manifest-webpack-plugin --save-dev
```

Basic Usage
-----------

The plugin need to work with [HtmlWebpackPlugin](https://www.npmjs.com/package/html-webpack-plugin) v2.10.0 and above:

__step1__: separate the runtime code
```javascript
[
	new webpack.optimize.CommonsChunkPlugin({
		names: ['vendor', 'manifest']
	})
]
```
__step2__: config HtmlWebpackPlugin:
```javascript
[
	new HtmlWebpackPlugin({
		excludeChunks: ['manifest'],
		template: './index.ejs'
	})
]
```

__step3__: configuration
* __name__: default value is `webpackManifest`,  result as `htmlWebpackPlugin.files[name]`, __you can specify any other name except `manifest`__, beacuse the name `manifest` haved been used by HtmlWebpackPlugin for H5 app cache manifest.
* __separator__: default value is `-`, this options is for find `manifest` chunk, when you build your bundle, you may include `chunkhash` string, eg: `filename: [name]-[chunkhash].js`, the separator is '-'; if you use other separator, just change this option.
```javascript
[
	new InlineManifestWebpackPlugin({
		name: 'webpackManifest',
		separator: '-'
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


<% if(htmlWebpackPlugin.files.webpackManifest){ %>
<script>
    <%=htmlWebpackPlugin.files.webpackManifest%>
</script>
<% } %>

</body>
</html>
```
__Done!__
