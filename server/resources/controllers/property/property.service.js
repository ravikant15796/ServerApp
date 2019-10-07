"use strict";

const mongoose =  require("mongoose");
require("./property.model");
const Property = mongoose.model("Property");

class PropertyService {
    async getPopularProperties(query){
        query = JSON.parse(JSON.stringify(query));
        return  await Property.find({citySlug:query.citySlug,enabled:true},{name:1, countrySlug:1, slug:1, citySlug:1, minPrice:1, media:1}).limit(8).lean(true);
    }
    async getProperties(citySlug,page){
        return  await Property.find({citySlug:citySlug,enabled:true}).skip((parseInt(page)-1)*10).limit(10).lean(true);
    }
    async getPropertyDetails(query){
        query = JSON.parse(JSON.stringify(query));
        return await Property.findOne({slug:query.propertySlug}).lean(true);
    }
    async findProperty(name) {
        return Property.find({
            "name": {
                "$regex": name, "$options": "i"
            },
            "enabled": true
        }).select("name city slug country citySlug countrySlug").limit(10).lean(true);
    }
}

module.exports = new PropertyService()
