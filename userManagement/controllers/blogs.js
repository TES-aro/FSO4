const blogsRouter = require('express').Router();
const Blog = require('../models/blog.js');
const Users = require('../models/user.js');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');



blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
	try {
		const body = request.body;
		if(!body.url || !body.title){
			throw new Error('missing a required field');
		}
		const decodedToken = jwt.verify(request.token, process.env.SECRET);
		if (!decodedToken.id) {
			return response.status(401).json({error: 'invalid token'});
		}
		const user = await Users.findById(decodedToken.id);
		if (!user) {
			throw new Error('missing userID')
		}
  	const blog = new Blog({
		 	title: body.title,
		 	author: body.author,
		 	url: body.url,
		 	likes: body.likes || 0,
			userID: user.id
  	})
  	const result = await blog.save()
  	response.status(201).json(result)
	} catch (e) {
		console.log("\n\n\n___ error ___")
		console.log(e)
		console.log("___")
		if (e.name === 'JsonWebTokenError'){
			response.status(401).json({error: 'tokken missing or invalid'})
			return
		}
		response.status(400).send(e)
	}
})

blogsRouter.delete('/:id', async (req, res) => {
	try{
		const id = req.params.id;
		if (!req.token){
			return res.status(401).json({error: 'invalid token'})
		}
		const decodedToken = jwt.verify(req.token, process.env.SECRET)
		if (!decodedToken.id) {
			return res.status(401).json({error: 'invalid token'})
		}
		const response = await Blog.findById(id);
		if (response.userID.toString() !== decodedToken.id){
			return res.status(401).json({error: 'invalid token'})
		}
		const delResponse = await Blog.findByIdAndDelete(id);
		res.status(200).send(delResponse.body)
	} catch (e) {
		console.log("\n\n___ error ___")
		console.log(e)
		res.status(400).send(e)
	}
})

blogsRouter.put('/:id', async (req, res) => {
	try{
		const id = req.params.id;
		const updatedBlog = req.body;
		// mutaatio, mutta eh
		delete updatedBlog.id;
		const response = await Blog.findByIdAndUpdate(id, updatedBlog, {
			runValidators: 'true', returnDocument: 'after'})
		res.status(200).send(response)
	} catch (e) {
		res.status(400).send(e)
	}
})

module.exports = blogsRouter;
