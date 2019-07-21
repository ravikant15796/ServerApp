"use strict";

const config = require("../config/config");
const express = require("express");

require("../server/db");

const app = express();
require("../server/middlewares/middleware")(app);
require("../server/resources/router").registerApiRoutes(app);

app.listen(config.port,(err,res)=>{
    console.log(`listening on port ${config.port}`)
});

