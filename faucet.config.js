"use strict";

module.exports = {
    js: [{
        source: "./views/index.js",
        target: "./dist/views.js",
        format: "CommonJS",
        jsx: { pragma: "createElement" }
    }]
};
