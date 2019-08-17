"use strict";
const mongoose = require("mongoose");
require("./university.model");
const University = mongoose.model("University");

class UniversityService {
    async searchUniversity(name) {
        return University.find({
            "name": {
                "$regex": name, "$options": "i"
            }
        }).select("name city slug country citySlug countrySlug");
    }
}

module.exports = new UniversityService();
