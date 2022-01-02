
const winston = require('winston');
//require('winston-mongodb');

require('express-async-errors');

module.exports = function(){
    
    winston.exceptions.handle(
        new winston.transports.File({filename: "uncaughtExceptions.log"},
        new winston.transports.Console({colorize: true, prettyPrint: true})));

    process.on('unhandledRejection', (ex) => {
        
        winston.error(ex.message, {meta: ex.stack});
        process.exit(1);
    })



    winston.add(new winston.transports.File({filename:"logfile.log"}));
    winston.add(new winston.transports.Console({colorize: true, prettyPrint: true}));
    // winston.add(new winston.transports.MongoDB({
    //     db: "mongodb://localhost/vidly",
    //     level: "error",
        
    // }));
}

