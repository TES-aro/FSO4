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
		console.log("------\n-----blog request token:")
		console.log(request.token)
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
		console.log("token's user:")
		console.log(user)
  	const blog = new Blog({
		 	title: body.title,
		 	author: body.author,
		 	url: body.url,
		 	likes: body.likes || 0,
			userID: user.id
  	})
  	const result = await blog.save()
  	console.log("blogsRouter.post result:")
  	console.log(result)
  	response.status(201).json(result)
	} catch (e) {
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
		const response = await Blog.findByIdAndDelete(id);
		res.status(200).send(response.body)
	} catch (e) {
		res.status(400).send(e)
	}
})

blogsRouter.put('/:id', async (req, res) => {
	try{
		const id = req.params.id;
		const updatedBlog = req.body;
		// mutaatio, mutta eh
		delete updatedBlog.id;
		console.log('-----')
		const response = await Blog.findByIdAndUpdate(id, updatedBlog, {
			runValidators: 'true', returnDocument: 'after'})
		console.log(response)
		res.status(200).send(response)
	} catch (e) {
		res.status(400).send(e)
	}
})

module.exports = blogsRouter;
