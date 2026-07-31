const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user.js')

usersRouter.post('/', async (request, response) => {
	try{
  	const { username, name, password } = request.body

  	const saltRounds = 10
  	const passwordHash = await bcrypt.hash(password, saltRounds)

  	const user = new User({
  	  username,
  	  name,
  	  passwordHash,
  	})

  	const savedUser = await user.save()

  	response.status(201).json(savedUser)
	} catch(e){
		response.status(400).json(e)
	}
})

usersRouter.get('/', async (req, res) => {
	try{
		const users = await Blog.find({});
		res.json(users)
	} catch(e) {
		res.status(500).json(e)
	}
})

module.exports = usersRouter
