const express = require('express');
const UserRouter = require('../routers/user');
const TaskRouter = require('../routers/task');
const http = require("http");
require("../db/mongoose");

const app = express();
app.use(express.static("../db"), express.static("../models"));
app.use(express.json());

app.use(UserRouter);
app.use(TaskRouter);

const server = http.createServer(app);
server.listen(3000, () => {console.log("Server started");});
module.exports = server;

