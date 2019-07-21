"use strict";
const express = require("express");
const errorHandlers = require("./lib/error.handler");
const app = express();

require("./middlewares")(app);
require("./");
