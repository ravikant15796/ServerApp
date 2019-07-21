"use strict";

const config = require("../config/config");
const express = require("express");
const port = process.env.PORT || 8000

require("../server/db");

const app = express();
require("../server/middlewares/middleware")(app);
require("../server/resources/router").registerApiRoutes(app);

app.listen(port,(err,res)=>{
    console.log(`listening on port ${port}`)
});

