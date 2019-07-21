"use strict";

let config = {
    port : 8000,
    dbUrl : "mongodb://ravikant15796:MyStack#1830@ds345587.mlab.com:45587/housingdb",
    currencySymbolMapping : {
        "USD" : "$",
        "AUD" : "A$",
        "GBP" : "£",
        "AED" : "AED",
        "SGD" : "S$",
        "EURO" : "€",
        "CAD" : "C$",
        "NZD" : "NZD",
        "KRW" : "₩"
    },
    pricingUnit : { "USD": "month", "AUD": "week", "GBP": "week", "AED": "month", "SGD": "month", "EURO": "week", "CAD": "week", "NZD": "week", "KRW" : "month" },
    suffixedCurrencies : ["AED","NZD"],
};

module.exports = config;
