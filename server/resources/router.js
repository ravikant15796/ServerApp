"use strict";
const TestController = require("../resources/controllers/test.controller");
const PropertyController  =require("../resources/controllers/property/property.controller");
const CityController = require("./controllers/city/city.contoller");
const SearchController = require("./controllers/search/search.controller");

exports.registerApiRoutes= (app)=>{
    let apiRouter = require('express').Router();
    app.use("/api",apiRouter);

    new TestController(apiRouter,"/test");
    new PropertyController(apiRouter,"/properties");
    new CityController(apiRouter,"/cities");
    new SearchController(apiRouter, "/search");
};



