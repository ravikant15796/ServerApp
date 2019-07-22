const morgan = require("morgan");
const bodyParser = require("body-parser");

module.exports = function(app){
    app.use(function(req,res,next){
        console.log(req.get('Origin'));
        res.header("Access-Control-Allow-Origin", "https://calm-taiga-50904.herokuapp.com");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
    app.use(morgan("dev"));
    app.use(bodyParser.json());
};
