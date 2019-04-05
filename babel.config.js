module.exports = {
    "presets": [
        [
            "@babel/preset-env",
            {
                targets: {
                    "ie": "11",
                    "chrome": "70",
                },
            }
        ]
    ],
    "plugins": [
        [
            "@babel/plugin-transform-runtime",
            {
                "absoluteRuntime": false,
                "corejs": false,
                "helpers": true,
                "regenerator": true,
                "useESModules": false
            }
        ]
    ]
}