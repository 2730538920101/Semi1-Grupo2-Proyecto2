const server = require('./src/server')
require("dotenv").config();
const host = process.env.SERVER_HOST;
const port = process.env.SERVER_PORT;

const servidor = server.listen(port, host, () => {
    console.log(`La API está escuchando en http://${host}:${port}`);
});

module.exports = servidor;