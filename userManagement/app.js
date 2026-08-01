const express = require('express')
const mongoose = require('mongoose')
const {PORT, MONGO_PASSWORD} = require('./utils/config.js');
const Blogs = require("./controllers/blogs.js");
const Users = require('./controllers/users.js');
const login = require('./controllers/login.js');
const middleware = require('./utils/middleware.js');

const app = express()

const mongoUrl = `mongodb+srv://fullstack:${MONGO_PASSWORD}@cluster0.ngt2jxd.mongodb.net/?appName=Cluster0`

mongoose.connect(mongoUrl, { family: 4 })

app.use(express.json())
app.use('/api/login', login)
app.use("/api/blogs", middleware.tokenExctractor, Blogs);
app.use('/api/users', Users)

module.exports = app;
