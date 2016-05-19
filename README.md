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
// the 'common' name below just for demonstration, replace it with yours
[
	new webpack.optimize.CommonsChunkPlugin({
		names: ['common', 'manifest']
	})
]
```
__step2__: config HtmlWebpackPlugin:
```javascript
[
	new HtmlWebpackPlugin({
		excludeChunks: ['manifest'],
		inject: false,
		template: './index.ejs'
	})
]
```

__step3__: use Inline Manifest Webpack Plugin
```javascript
[
	new InlineManifestWebpackPlugin()
]
```
It will fill the `htmlWebpackPlugin.files.manifest` filed with manifest's source code, you can use in your template as blow.

```html
<!-- index.ejs -->
<!doctype html>
<html>
<head>
	<meta charset="UTF-8">
	<title>App</title>
	<% for (var css in htmlWebpackPlugin.files.css) { %>
	<link href="<%= htmlWebpackPlugin.files.css[css] %>" rel="stylesheet">
	<% } %>
</head>
<body>


<% if(htmlWebpackPlugin.files.manifest){ %>
<script>
	<%=htmlWebpackPlugin.files.manifest%>
</script>
<% } %>
<% for (var chunk in htmlWebpackPlugin.files.chunks) { %>
<script src="<%= htmlWebpackPlugin.files.chunks[chunk].entry %>"></script>
<% } %>
</body>
</html>
```
__Done!__
