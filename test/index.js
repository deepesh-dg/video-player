const express = require("express");
const app = express();
const path = require("path");
const isReachable = require("is-reachable");
const cors = require("cors");

const host = "127.0.0.1";
let port = 3000;

app.use(cors());
app.use(
    "/static/bootstrap",
    express.static(path.join(__dirname, "../node_modules/bootstrap/dist/"))
);
app.use("/static", express.static(path.join(__dirname, "../public")));
app.use("/assets", express.static(path.join(__dirname, "./assets")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/index.html"));
});

(async () => {
    for (; port < 67500; port++) {
        if (!(await isReachable(`${host}:${port}`))) break;
    }
    app.listen(port, host, () =>
        console.log(`Server running at http://${host}:${port}/`)
    );
})();
