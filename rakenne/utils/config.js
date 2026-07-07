require('dotenv').config();

const PORT = process.env.PORT ? process.env.PORT : 3001;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;

console.log(`password from .env: ${MONGO_PASSWORD}`)

module.exports = {PORT, MONGO_PASSWORD}
