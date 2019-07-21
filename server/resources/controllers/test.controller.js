"use strict";

const BaseController = require("../../lib/base.controller");

class TestController extends BaseController {
    constructor(router,basePath){
        super(router,basePath);
        this.registerApiRoutes();
    }
    registerApiRoutes(){
        this.router.get(`${this.basePath}`,this.handleAsyncErrors(this.testMethod));
    }

    async testMethod(req,res){
        res.send("working");
    }
}

module.exports = TestController;
