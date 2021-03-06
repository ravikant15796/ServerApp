"use strict";

const PropertyController  =require("../resources/controllers/property/property.controller");
const CityController = require("./controllers/city/city.contoller");
const SearchController = require("./controllers/search/search.controller");
const CmsController = require("./controllers/cms/cms.controller");

exports.registerApiRoutes= (app)=>{
    let apiRouter = require('express').Router();
    app.use("/api",apiRouter);

    new CmsController(apiRouter,"/cms");
    new PropertyController(apiRouter,"/properties");
    new CityController(apiRouter,"/cities");
    new SearchController(apiRouter, "/search");
};



