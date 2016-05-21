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

__step3__: configuration, there's only one option right now, the default value of `name` is `webpackManifest`,  result as `htmlWebpackPlugin.files[name]`, __you can specify any other name except `manifest`__, beacuse the name `manifest` haved been used by HtmlWebpackPlugin for H5 app cache manifest.
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


<% if(htmlWebpackPlugin.files.webpackManifest){ %>
<script>
    <%=htmlWebpackPlugin.files.webpackManifest%>
</script>
<% } %>

</body>
</html>
```
__Done!__
