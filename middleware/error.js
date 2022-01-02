
const winston = require('winston');

module.exports = function(err,req,res,next){
    
    winston.error(err.message, err);//doesnt show stack for some reason, meta: null in

    res.status(500).send('Something failed');
}