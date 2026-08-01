const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user.js');
const Blog = require('../models/blog.js');

usersRouter.post('/', async (request, response) => {
	try{
		console.log("in usersRouter.post")
  	const { username, name, password } = request.body
  	console.log(username)
  	if (password.length < 3){
	  	throw new Error('password is not strong enough')
  	}

  	if (!username) {
	  	throw new Error('username is required')
  	}
  	if (!name) {
	  	throw new Error('name is required')
  	}

  	const saltRounds = 10
  	const passwordHash = await bcrypt.hash(password, saltRounds)

  	const user = new User({
  	  username,
  	  name,
  	  passwordHash,
  	})

  	const savedUser = await user.save()
  	console.log(`saved user:`)
  	console.log(savedUser)

  	response.status(201).json(savedUser)
	} catch(e){
		response.status(400).json(e)
	}
})

usersRouter.get('/', async (req, res) => {
	try{
		const users = await User.find({});
		console.log(`user 0 = ${users[0]}`)
		//jostain syysttä Blog.find({userID: user.id}) ei toiminut.
		//ongelmana ei ollyt typo tai puuttuva _ vaan promise sekoilu
		const allBlogs = await Blog.find({});
		const sensoredUsers = users.map( user => {
			const newUser = {
				username: user.username,
				name: user.name,
				id: user._id,
			}
			let blogs = [];
			console.log('all blogs:')
			console.log(allBlogs)
			allBlogs.forEach(blog => {
				console.log(blog)
				if(!blog.userID){
					return
				}
				if (blog.userID.toString() === newUser.id.toString()){
					const newBlog = {
						url: blog.url,
						title: blog.title,
						author: blog.author,
						id: blog.id.toString()
					}
					blogs = blogs.concat(newBlog)
				}
				console.log("blogs:")
				console.log(blogs)
			})
			console.log(blogs)
			if (blogs.length > 0){
				newUser.blogs = blogs
			}
			return newUser
		})
		console.log("sensored users:")
		console.log(sensoredUsers)
		res.status(200).json(sensoredUsers)
	} catch(e) {
		res.status(500).json(e)
	}
})

module.exports = usersRouter
