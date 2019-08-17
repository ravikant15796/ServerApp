"use strict";

const mongoose =  require("mongoose");
require("./property.model");
const Property = mongoose.model("Property");

class PropertyService {
    async getPopularProperties(query){
        query = JSON.parse(JSON.stringify(query));
        return  await Property.find({citySlug:query.citySlug,enabled:true},{name:1, countrySlug:1, slug:1, citySlug:1, minPrice:1, media:1}).limit(8);
    }
    async getProperties(query){
        query = JSON.parse(JSON.stringify(query));
        return  await Property.find({citySlug:query.citySlug,enabled:true}).limit(8);
    }
    async getPropertyDetails(query){
        query = JSON.parse(JSON.stringify(query));
        return await Property.findOne({slug:query.propertySlug});
    }
    async findProperty(name) {
        return Property.find({
            "name": {
                "$regex": name, "$options": "i"
            },
            "enabled": true
        }).select("name city slug country citySlug countrySlug").limit(10);
    }
}

module.exports = new PropertyService()
