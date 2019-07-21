"use strict";

const config = require("../config/config");
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

mongoose.connect(config.dbUrl,  {useNewUrlParser: true }, (err,res)=>{
    if(err){
        console.log(err);
    }
});

