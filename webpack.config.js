const path = require("path");

module.exports = {
    mode: process.env.NODE_ENV ?? "production",
    entry: "./src/index.ts",
    target: "web",
    resolve: {
        extensions: [".ts", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: ["ts-loader"],
            },
            {
                test: /\.(s[ac]|c)ss$/,
                use: [
                    "style-loader",
                    "css-loader",
                    "sass-loader",
                    "postcss-loader",
                ],
            },
        ],
    },
    output: {
        filename: "video-player.bundle.js",
        path: path.resolve(__dirname, "public"),
    },
};
