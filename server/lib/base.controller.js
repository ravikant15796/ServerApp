"use strict";

const errorHandler = require("./error.handler");

class BaseController {
    constructor(router,basePath){
        if(!router || !basePath) throw Error("Incomplete path");
        this.router = router;
        this.basePath = basePath
    }

    handleAsyncErrors(fn){
        return errorHandler.catchErrors(fn. bind(this));
    }
}


module.exports = BaseController;
