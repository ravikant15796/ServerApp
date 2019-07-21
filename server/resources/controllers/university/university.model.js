"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const URLSlugs = require("mongoose-url-slugs");

const universitySchema = new Schema({
    name: {
        type: String,
        index: true
    },
    description: String,
    listingOrder : {
        type : Number,
        index : true
    }, // added listingorder
    country: String,
    city: String,
    isFeatured : Boolean,
    citySlug: String,
    countrySlug : String,
    cityId: {
        type: Schema.Types.ObjectId,
        index: true
    },
    thumbnail: {
        url: String,
        description: String
    },
    meta: {
        title: String,
        imageUrl: String,
        h1: String,
        h2: String,
        keywords: String,
        description: String
    },
    campus: [
        {
            name: String,
            description: String,
            isMainCampus: Boolean,
            lat: Number,
            lng: Number,
            slug: String,
            meta: {
                title: String,
                imageUrl: String,
                h1: String,
                h2: String,
                keywords: String,
                description: String
            },
            thumbnail: {
                url: String,
                description: String
            }
        }
    ],
    slug: {
        type: String,
        unique: true,
        index: true
    }
}, {
    timestamps: {
        createdAt: "createdAt",
        updatedAt: "updatedAt"
    },
    toJSON: {
        transform: function (doc, ret) {
            ret.universityId = ret._id;
            ret.campus && ret.campus.map(campus => {
                delete campus._id;
            });
            delete ret._id;
            delete ret.__v;
            delete ret.createdAt;
            delete ret.updatedAt;
        }
    }
});

class University { }
universitySchema.pre("save", function (next) {
    this.campus.map(campus => {
        campus.slug = campus.name.toLowerCase().replace(/ /g, "-");
    });
    next();
});
universitySchema.loadClass(University);
universitySchema.plugin(URLSlugs("name", { field: "slug" }));

module.exports = mongoose.model("University", universitySchema);
