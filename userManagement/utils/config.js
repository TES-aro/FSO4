require('dotenv').config();

const PORT = process.env.PORT ? process.env.PORT : 3001;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
const SALT = process.env.SALT ? process.env.SALT : "suola";
const SECRET = process.env.SECRET;

console.log(`password from .env: ${MONGO_PASSWORD}`)

module.exports = {PORT, MONGO_PASSWORD, SALT, SECRET}
