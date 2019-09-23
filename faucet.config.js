"use strict";

module.exports = {
    js: [{
        source: "./src/main/resources/views/index.js",
        target: "./dist/views.js",
        format: "CommonJS",
        jsx: { pragma: "createElement" }
    }]
};
