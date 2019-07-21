const PropertyService = require('./property.service');
const mongoose = require("mongoose");
const Property = mongoose.model("Property");
const fetch = require("node-fetch");
const BaseController = require('../../../lib/base.controller');


class PropertyController extends  BaseController{
    constructor(apiRouter,basePath){
        super(apiRouter,basePath);
        this.registerApiRoutes();
    }
   registerApiRoutes(){
        this.router.get(`${this.basePath}`,this.handleAsyncErrors(this.getProperties));
    }

    async getProperties(req,res){
        let {
            citySlug,
            type,
            name,
            category,
            page,
            minPrice,
            maxPrice,
            amenities
        } = req.query


        let properties =  await PropertyService.getPopularProperties({
            citySlug,
            type,
            name,
            category,
            page,
            minPrice,
            maxPrice,
            amenities
        });
        res.send(properties);
    }
}

module.exports = PropertyController;
