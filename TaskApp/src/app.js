const express = require('express');
const userRouter = require('../routers/user');
const taskRouter = require('../routers/task');
const http = require("http");
const port = 3000;
require("../db/mongoose");

const app = express();
app.use(express.static("../db"), express.static("../models"));
app.use(express.json());

app.use(userRouter);
app.use(taskRouter);

const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Server started on port ${port}`);
});


module.exports = server;