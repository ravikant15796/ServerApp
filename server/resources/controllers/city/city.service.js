const mongoose =  require("mongoose");
require("./city.model");
const City = mongoose.model("City");


class CityService{

  async getHomeCities(query){
      query = JSON.parse(JSON.stringify(query));
      return await  City.find({isFeatured:true},{name:1,"thumbnail.url":1,countrySlug:1,slug:1}).limit(6);
  }
    async searchCity(name) {
        return City.find({
            "name": {
                "$regex": name, "$options": "i"
            }
        }).select("name slug country countrySlug").limit(10);
    }


}

module.exports = new CityService();
