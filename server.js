const server = require('./index')
const winston = require('winston');

const port = process.env.PORT || 3000;

server.listen(port, () => {
    winston.info(`Listening on port ${port}...`)
});

module.exports = server;