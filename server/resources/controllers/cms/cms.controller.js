
const mongoose = require("mongoose");
const fetch = require("node-fetch");
const BaseController = require('../../../lib/base.controller');
const CmsService = require("./cms.service");


class CmsController extends BaseController{
    constructor(apiRouter,basePath){
        super(apiRouter,basePath);
        this.registerApiRoutes();
    }
    registerApiRoutes(){
        this.router.get(`${this.basePath}`,this.handleAsyncErrors(this.getProperties));
    }
    async getProperties(req,res) {
        let {enabled, featured} = req.params;
        let foundProerties = await CmsService.getPoperties(enabled);
        res.send(foundProerties);
    }
    async getProperties(req,res) {
        let isFinished = await CmsService.changeUrl()
        res.send(isFinished.rooms);
    }
}

module.exports = CmsController;
