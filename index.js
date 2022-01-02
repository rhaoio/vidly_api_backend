const winston = require("winston");
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/validation")();
require("./startup/prod")(app);

// const EventEmitter = require('events');

// const emitter = new EventEmitter();

//app.set('view engine', 'pug');//FOR FRONT END
//app.set('views', './views'); //FOR FRONT END

const port = process.env.PORT || 4000;

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    winston.info(`Listening on port ${port}...`);
  });
}

module.exports = app;
// emitter.on('EMITTING',function(){
//     console.log('Listener called...');
// });

// emitter.emit('EMITTING');
