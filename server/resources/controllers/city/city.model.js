"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const URLSlugs = require("mongoose-url-slugs");


const citySchema = new Schema({
    name: {
        type: String,
        index: true
    }, //e.g London
    description: String, // Description of the city,
    listingOrder : {
        type : Number,
        index : true
    },
    countrySlug: String,
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
                enum: Object.values({
                    "IMAGE": "image",
                    "VIDEO": "video"
                })
            },
            url: String,
            description: String
        }
    ],
    country: String, //e.g United Kingdom
    location: { // Required for distance based searches
        lat: Number,
        lng: Number
    },
    isFeatured: Boolean,
    thumbnail: {
        url: String,
        description: String
    },
    slug: {
        type: String,
        unique: true,
        index: true
    },
    countryId: {
        type: Schema.Types.ObjectId
    }
}, {
    timestamps: {
        createdAt: "createdAt",
        updatedAt: "updatedAt"
    },
    toJSON: {
        transform: function (doc, ret) {
            ret.cityId = ret._id;
            delete ret._id;
            delete ret.__v;
            delete ret.createdAt;
            delete ret.updatedAt;
        }
    }

});

class City { }

citySchema.loadClass(City);
citySchema.plugin(URLSlugs("name", { field: "slug" }));

module.exports = mongoose.model("City", citySchema);
