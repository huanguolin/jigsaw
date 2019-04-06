module.exports = {
    "presets": [
        [
            "@babel/preset-env",
            {
                targets: {
                    "ie": "11",
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
                "helpers": false,
                "regenerator": true,
                "useESModules": false
            }
        ]
    ]
}