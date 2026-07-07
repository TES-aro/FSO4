const blogsRouter = require('express').Router();
const Blog = require('../models/blog.js');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
	const body = request.body;
	if(!body.url || !body.title){
		response.status(400).send('missing a required field')
	}else{
  	const blog = new Blog({title: body.title, author: body.author, url: body.url, likes: body.likes || 0})
  	const result = await blog.save()
  	response.status(201).json(result)
	}
})

blogsRouter.delete('/:id', async (req, res) => {
	const id = req.params.id;
	const response = await Blog.findByIdAndDelete(id);
	res.status(200).send(response.body)
})

blogsRouter.put('/:id', async (req, res) => {
	const id = req.params.id;
	const updatedBlog = req.body;
	delete updatedBlog.id;
	console.log('-----')
	const response = await Blog.findByIdAndUpdate(id, updatedBlog, {
		runValidators: 'true', returnDocument: 'after'})
	console.log(response)
	res.status(200).send(response)
})

module.exports = blogsRouter;
