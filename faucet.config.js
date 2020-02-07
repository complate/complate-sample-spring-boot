"use strict";

let templateDir = "./src/main/jsx";

module.exports = {
    watchDirs: [templateDir],
    js: [{
        source: templateDir + "/index.js",
        target: "./target/classes/templates/complate/bundle.js",
        exports: "render",
        esnext: {
            exclude: ["classnames"]
        },
        jsx: { pragma: "createElement" }
    }]
};
