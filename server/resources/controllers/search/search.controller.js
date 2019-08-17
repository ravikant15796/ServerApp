"use strict";

const BaseController = require("../../../lib/base.controller");
const CityService = require("../city/city.service");
const PropertyService = require("../property/property.service");
const UniversityService = require("../university/university.service");

class SearchController extends BaseController {
    constructor(apiRouter, basePath) {
        super(apiRouter, basePath);
        this.registerRoutes();
    }
    registerRoutes() {
        this.router.get(`${this.basePath}`,
            this.handleAsyncErrors(this.findMatchingEntities)
        );
    }
    async findMatchingEntities(req, res) {
        let {
            searchTerm
        } = req.query;

        let [citiesFound, propertiesFound, universitiesFound] = await Promise.all([
            CityService.searchCity(searchTerm),
            PropertyService.findProperty(searchTerm),
            UniversityService.searchUniversity(searchTerm),
        ]);
        res.send({
            cities: citiesFound,
            universities: universitiesFound,
            properties: propertiesFound
        });
    }
}

module.exports = SearchController;
