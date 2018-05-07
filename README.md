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

This plugin need to work with [webpack v4](https://github.com/webpack/webpack) (for webpack v3 and below, pls use [version 3](https://github.com/szrenwei/inline-manifest-webpack-plugin/tree/v3.0.1)) and [HtmlWebpackPlugin v3](https://www.npmjs.com/package/html-webpack-plugin) :

__Step1__: split out the runtime code
```javascript
// the default name is "runtime"
optimization: {
    runtimeChunk: 'single'
 }

// or specify another name
optimization: {
    name: 'another name'
 }

```
__Step2__: add plugins:
```javascript
// this plugin need to put after HtmlWebpackPlugin
[
    new HtmlWebpackPlugin(),
    new InlineManifestWebpackPlugin()
]

or

[
    new HtmlWebpackPlugin(),
    // if you changed the runtimeChunk's name, you need to sync it here
    new InlineManifestWebpackPlugin('anothe name')
]

```
__Done!__ This will add a script tag which contains the runtime code just before any other scripts.
