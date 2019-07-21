const CityService = require('./city.service');
const mongoose = require("mongoose");
const fetch = require("node-fetch");
const BaseController = require('../../../lib/base.controller');
const PropertyService = require("../property/property.service");


class CityController extends BaseController{
    constructor(apiRouter,basePath){
        super(apiRouter,basePath);
        this.registerApiRoutes();
    }
    registerApiRoutes(){
        console.log('****');
        this.router.get(`${this.basePath}`,this.handleAsyncErrors(this.getCityList));
        this.router.get(`${this.basePath}/:citySlug/properties`,this.handleAsyncErrors(this.getPropertyListing))
    }
   async getCityList(req,res){
       let {
           countrySlug,
           limit
       } = req.query;

       let homeCities = await CityService.getHomeCities({countrySlug});
       res.send(homeCities);
    }
    async getPropertyListing(req,res){
        let {
            citySlug
        } = req.params;

        let propertyListing = await PropertyService.getProperties({
            citySlug
        });
        res.send(propertyListing);
    }
}

module.exports = CityController;
