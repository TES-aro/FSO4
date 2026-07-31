const express = require('express')
const mongoose = require('mongoose')
const {PORT, MONGO_PASSWORD} = require('./utils/config.js');
const Blogs = require("./controllers/blogs.js");


const app = express()

const mongoUrl = `mongodb+srv://fullstack:${MONGO_PASSWORD}@cluster0.ngt2jxd.mongodb.net/?appName=Cluster0`

mongoose.connect(mongoUrl, { family: 4 })

app.use(express.json())
app.use("/api/blogs", Blogs);

module.exports = app;
