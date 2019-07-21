"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const URLSlugs = require("mongoose-url-slugs");

const PROPERTY_TYPE = require("./constants/property.type");
const MEDIA_TYPE = require("./constants/media.type");
const AVALIBILITY_TYPE = require("../properties/constants/availability.type.json");
const config = require("../../../config/index");
const pricingUnit = config.pricingUnit;
const currencySymbolMapping = config.currencySymbolMapping;
const suffixedCurrencies = config.suffixedCurrencies;
const moment = require("moment");

const propertySchema = new Schema({
    name: {
        type: String,
        index: true
    },
    isCRMID : String,
    mostPopular : Boolean,
    providerAutomated : Boolean,
    isNominated : Boolean,
    description: String,
    baseCurrencyCode: String, //Currency code for all the rates
    address: String,
    citySlug: String,
    countrySlug: String,
    minPrice:Number,
    city: String,
    cityId: {
        type: Schema.Types.ObjectId,
        index: true
    },
    country: String,
    neighbourhood: String,

    location: {
        type: Array,  // [<longitude>, <latitude>]
        index: "2dsphere" // create the geospatial index
    }, //Legacy point: longitude, latitude

    type: { // PBSA, APARTMENT
        type: String,
        enum: Object.values(PROPERTY_TYPE),
        required: true,
        index: true
    },

    rating: Number, // Rating of the city (entered manually by the ops team)

    //??BUSINESS??: How is distanceFromCityCenter calculated
    distanceFromCityCenter: Number, // In kms, Kept as number so that it can be converted to other metric units easily,
    features: {
        amenities: [ String ], //Searchable features
        rentIncludes: [String],
        safetyAndSecurity: [String]
    },

    enabled: {
        type: Boolean,
        default: false,
        index: true
    },

    isSuggested: {
        type: Boolean,
        default: false,
        index: true
    },
    listingOrder: {
        type: Number,
        default: 999
    },
    thumbnail: {
        url: String,
        description: String
    },

    slug: {
        type: String,
        unique: true,
        index: true
    },

    offers: [ // Any ongoing offers for the property, e.g Cashbacks, Early bird offer etc.
        {
            info: {type : String, default : "NA"},
            message: {type : String, default : "NA"},
            validTill : Date
        }
    ],

    meta: {
        title: String,
        imageUrl: String,
        heading: String,
        subheading: String,
        keywords: String,
        description: String
    },

    media: [
        {
            type: {
                type: String,
                enum: Object.values(MEDIA_TYPE)
            },
            url: String,
            description: String
        }
    ],

    // ROOMS IN THE PROPERTIES
    rooms: [ //STUDIO,
        {
            title: String,
            category: {
                type: String,
                index: true
            }, //Studio/Ensuite/Apartment/Shared/Houses/Service Apartments
            minPrice : Number,
            description : String,
            images: [
                {
                    url: String,
                    description: String
                }
            ],
            offers:[
                {
                    info : {type : String, default : "NA"},
                    message : {type : String, default : "NA"},
                    validTill : Date
                }
            ],
            types: [ // GOLD, SILVER, BRONZE // NORMAL,SUPERIOR, PREMIUM
                {
                    isNominated : Boolean,
                    title: String,
                    providerAvailability: String, //
                    area: String,
                    description : String,
                    offers: [
                        {
                            info : {type : String, default : "NA"},
                            message : {type : String, default : "NA"},
                            validTill : Date
                        }
                    ],
                    areaUnit: String,
                    allocatedRooms: Number, //Number of rooms for this category
                    images: [
                        {
                            url: String,
                            description: String,
                            isFeatured : Boolean
                        }
                    ],
                    rates: [
                        {
                            allocatedRooms : Number,
                            tenancy: String,
                            discountedPrice: Number,
                            checkInDate : Date,
                            checkoutDate: Date,
                            providerAvailability: String,
                            CRMID : String,
                            price: Number, //Price per price Unit eg 213 GBP/week
                            priceUnit: String //week/month etc
                        }
                    ]
                }
            ]
        }
    ],
    nearbyUniversities: [
        {
            name : String,
            cityId : Schema.Types.ObjectId,
            city : String,
            country : String,
            slug : String,
            hasCampus : Boolean,
            placeId : String,
            campus : [
                {
                    lat : Number,
                    lng : Number,
                    slug : String,
                    isMainCampus : Boolean,
                    name : String,
                    transit : {
                        walking : String,
                        driving : String,
                        public : String,
                        distance : String
                    }
                }
            ]
        }
    ],
    bookingProcedure: String,
    whatWeLove : String

}, {
    timestamps: {
        createdAt: "createdAt",
        updatedAt: "updatedAt"
    },
    toJSON: {
        transform: function (doc, ret) {
            ret.propertyId = ret._id;
            ret.coordinates = {
                longitude: ret.location && ret.location[0],
                latitude: ret.location && ret.location[1]
            };
            ret.propertyId = ret._id;
            if(ret.nearbyUniversities){
                ret.nearbyUniversities.map((university)=>{
                    university.name = university.name.split(",")[0];
                });
            }

            // Added offers expiry date
            if(ret.offers){
                if(ret.offers.length > 0){
                    if(ret.offers[0].validTill){
                        if(moment(new Date()).diff(moment(new Date(ret.offers[0].validTill))) > 0){
                            if(!(moment(new Date()).isSame(ret.offers[0].validTill, "day"))) {
                                ret.offers[0].message = "NA";
                                ret.offers[0].info = "NA";
                            }
                        }
                    }
                }
            }

            if(ret.rooms){
                ret.rooms.map((room) => {
                    if(room.offers){
                        if(room.offers.length > 0){
                            if(room.offers[0].validTill){
                                if(moment(new Date()).diff(moment(new Date(room.offers[0].validTill))) > 0){
                                    if(!(moment(new Date()).isSame(room.offers[0].validTill, "day"))) {
                                        room.offers[0].message = "NA";
                                        room.offers[0].info = "NA";
                                    }
                                }
                            }
                        }
                    }
                    room.types.map((type) => {
                        if(type.offers){
                            if(type.offers.length > 0){
                                if(type.offers[0].validTill){
                                    if(moment(new Date()).diff(moment(new Date(type.offers[0].validTill))) > 0){
                                        if(!(moment(new Date()).isSame(type.offers[0].validTill, "day"))) {
                                            type.offers[0].message = "NA";
                                            type.offers[0].info = "NA";
                                        }
                                    }
                                }
                            }
                        }

                        type.rates.map((rate) => {
                            rate.tenancyId = rate._id;
                            rate.displayPrice = createDisplayPriceString(ret.baseCurrencyCode, rate.price, rate.priceUnit);
                            if(rate.discountedPrice)
                                rate.displayDiscountedPrice = createDisplayPriceString(ret.baseCurrencyCode, rate.discountedPrice, rate.priceUnit);
                            delete rate._id;
                        });
                    });
                });
                ret.displayPrice = createDisplayPriceString(ret.baseCurrencyCode, ret.minPrice, ret.rooms[0].types[0].rates[0].priceUnit);
            }
            delete ret.location;
            delete ret._id;
            delete ret.__v;
        }
    }
});

class Property { }


propertySchema.post("find", (result, next) => {
    let priceUnit = "";
    result.map((foundRecord) => {
        foundRecord.propertyId = foundRecord._id;
        foundRecord.coordinates = {
            longitude: foundRecord.location && foundRecord.location[0],
            latitude: foundRecord.location && foundRecord.location[1]
        };
        foundRecord.propertyId = foundRecord._id;

        // Added offers expiry date
        if(foundRecord.offers){
            if(foundRecord.offers.length > 0){
                if(foundRecord.offers[0].validTill){
                    if(moment(new Date()).diff(moment(new Date(foundRecord.offers[0].validTill))) > 0){
                        if(!(moment(new Date()).isSame(foundRecord.offers[0].validTill, "day"))) {
                            foundRecord.offers[0].message = "NA";
                            foundRecord.offers[0].info = "NA";
                        }
                    }
                }
            }
        }

        if(foundRecord.rooms) {
            foundRecord.rooms.map((room) => {
                if(room.offers){
                    if(room.offers.length > 0){
                        if(room.offers[0].validTill){
                            if(moment(new Date()).diff(moment(new Date(room.offers[0].validTill))) > 0){
                                if(!(moment(new Date()).isSame(room.offers[0].validTill, "day"))) {
                                    room.offers[0].message = "NA";
                                    room.offers[0].info = "NA";
                                }
                            }
                        }
                    }
                }

                room.types.map((type) => {
                    if(type.offers){
                        if(type.offers.length > 0){
                            if(type.offers[0].validTill){
                                if(moment(new Date()).diff(moment(new Date(type.offers[0].validTill))) > 0){
                                    if(!(moment(new Date()).isSame(type.offers[0].validTill, "day"))) {
                                        type.offers[0].message = "NA";
                                        type.offers[0].info = "NA";
                                    }
                                }
                            }
                        }
                    }
                    let typeSoldOutObj = returnMatchedArray(type.rates);
                    type.isSoldOut = Array.isArray(typeSoldOutObj) && typeSoldOutObj.length == type.rates.length ? true : false;

                    type.rates.map((rate) => {
                        rate.tenancyId = rate._id;
                        rate.displayPrice = createDisplayPriceString(foundRecord.baseCurrencyCode, rate.price, rate.priceUnit);
                        if(rate.discountedPrice)
                            rate.displayDiscountedPrice = createDisplayPriceString(foundRecord.baseCurrencyCode, rate.discountedPrice, rate.priceUnit);
                        delete rate._id;
                    });
                });

                let categorySoldOutObj = returnMatchedArray(room.types);
                room.isSoldOut = Array.isArray(categorySoldOutObj) && categorySoldOutObj.length == room.types.length ? true : false;
            });

            let propertySoldOutObj = returnMatchedArray(foundRecord.rooms);
            foundRecord.isSoldOut = Array.isArray(propertySoldOutObj) && propertySoldOutObj.length == foundRecord.rooms.length ? true : false;
            foundRecord.displayPrice = createDisplayPriceString(foundRecord.baseCurrencyCode, foundRecord.minPrice, foundRecord.rooms[0].types[0].rates[0].priceUnit);
        }

        delete foundRecord.location;
        delete foundRecord._id;
        delete foundRecord.__v;
    });
    next();
});
function returnMatchedArray(arr) {
    if (!arr) return [];
    return arr.filter(function (obj) {
        if(obj.providerAvailability == AVALIBILITY_TYPE.SOLD_OUT || obj.isSoldOut)
            return obj;
    });
}

function createDisplayPriceString(currencyCode, price, priceUnit) {
    let displayPrice = "";
    if (suffixedCurrencies.indexOf(currencyCode) > -1) {
        displayPrice = `${price}${priceUnit}`;
        return displayPrice;
    }
    displayPrice = `${priceUnit.split("/")[0]}${price}/${priceUnit.split("/")[1]}`
    return displayPrice;
}
propertySchema.loadClass(Property);
propertySchema.plugin(URLSlugs("name", { field: "slug" }));

module.exports = mongoose.model("Property", propertySchema);


