"use strict";

let templateDir = "./src/main/resources/views";

module.exports = {
    watchDirs: [templateDir],
    js: [{
        source: templateDir + "/index.js",
        target: "./target/classes/dist/views.js",
        jsx: { pragma: "createElement" },
        esnext: true,
        format: "esm",
    }]
};
