const express = require("express");
const path = require("path");
const http = require("http");
const mainRouter = require("./routes/indexRoutes");
require("./db/dbConnect")
const cors = require("cors")

const app = express();

app.use(cors())
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.use(mainRouter);

const server = http.createServer(app);
const port = process.env.PORT || 3001;
server.listen(port);
