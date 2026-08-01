const mongoose = require('mongoose');
const supertest = require('supertest');
const { test, describe, beforeEach, after, before } = require('node:test')
const assert = require('node:assert')

const helper = require('../utils/test_helpers.js')
const app = require('../app.js');
const Blog = require('../models/blog.js');
const User = require('../models/user.js');

const api = supertest(app);


beforeEach( async () => {
	await User.deleteMany({})
	const rootUser = {
		username: 'root',
		password: 'salasana',
		name: 'root'
	}
	const response = await api.post('/api/users').send(rootUser)
	console.log(`new user's ID: ${response.body.id}`)
	rootId = response.body.id;
	await Blog.deleteMany({})
	console.log('clear')
	await Blog.insertMany(helper.initialNotes)
	//await helper.initialNotes.forEach(async (note) => {
	//	let newBlog = new Blog(note)
	//	await newBlog.save()
	//})
	console.log('added initial blogs')
})

describe('testing token', () => {
	test('login', async () => {
		const info = {
			username: 'root',
			password: 'salasana'
		}
		const res = await api.post('/api/login').send(info);
		console.log("login body:")
		console.log(res.body)
		let matches = false
		if (res.body.token){
			matches = true;
		}
		assert.equal(matches, true);
	})
	test('improper password', async () => {
		const info = {
			username: 'root',
			password: 'WrongPassword'
		}
		await api.post('/api/login').send(info).expect(401);
	})
})

describe.only('require token for actions', () => {
	test('adding a blog', async () => {
		const info = {
			username: 'root',
			password: 'salasana'
		}
		const loginRes = await api.post('/api/login').send(info);
		const token = loginRes.body.token;
		const blog = helper.notesList[0];
		const res = await api.post('/api/blogs').auth(token, {type: 'bearer'}).send(blog).expect(201)
	})
})

describe('basic properties', () => {
	test('returns as JSON', async () => {
		await api.get('/api/blogs').expect(200).expect('Content-Type', /application\/json/)
	})
	test('initial collection is of correct size', async () => {
		const response = await api.get('/api/blogs');
		assert.strictEqual(response.body.length, helper.initialNotes.length)
	})
	test(`id field doesn't have a '_'`, async () => {
		const response = await api.get('/api/blogs');
		const keys = Object.keys(response.body[0]);
		const matches = keys.includes("id") && !keys.includes("_id");
		assert.strictEqual(matches, true);
	})
})

describe('testing ADD to /api/blogs', () => {
	test('adding', async () => {
		const originaResponse = await api.get('/api/blogs')
		console.log(originaResponse.body)
		const newBlog = helper.notesList[0];
		await api.post('/api/blogs').send(newBlog).expect(201);
		const response = await api.get('/api/blogs');
		console.log(`response length: ${response.body.length}`)
		console.log(`expected length: ${helper.initialNotes.length} + 1`)
		assert.strictEqual(response.body.length, (helper.initialNotes.length + 1))
	})
})

describe('adding multiple entries', () => {
	test('adding multiple', async () => {
		const originalResponse = await api.get('/api/blogs');
		console.log(`original size: ${originalResponse.body.length}`)
		const blogList = helper.notesList;
		const promiseArray = blogList.map(blog => api.post('/api/blogs').send({title: blog.title, author: blog.author, url: blog.url, likes: blog.likes}))
		await Promise.all(promiseArray)
		const endResponse = await api.get('/api/blogs');
		assert.strictEqual(endResponse.body.length, (blogList.length + 1))
	})
})

describe('missing values', () => {
	test('no likes', async () => {
		const newBlog = helper.notesList[0];
		delete newBlog.likes
		console.log('missing likes blog')
		console.log(newBlog)
		const res = await api.post('/api/blogs').send(newBlog)
		console.log(res.body)
		assert.strictEqual(res.body.likes, 0)
	})

	test('no URL', async () => {
		const newBlog = helper.notesList[1];
		delete newBlog.url;
		await api.post('/api/blogs').send(newBlog).expect(400)
	})

	test('no title', async () => {
		const newBlog = helper.notesList[1];
		delete newBlog.title;
		await api.post('/api/blogs').send(newBlog).expect(400)
	})
})

describe('deleting and editing', () => {
	test('editing', async () => {
		const blogs = await api.get('/api/blogs');
		const blog = blogs.body[0];
		console.log(blog)
		blog.likes += 1;
		const response = await api.put(`/api/blogs/${blog.id}`).send(blog);
		console.log(response.body)
		assert.strictEqual(blog.likes, response.body.likes)
	})

	test('deleting by ID', async () => {
		const blogs = await api.get('/api/blogs')
		const id = blogs.body[0].id
		console.log(id)
		await api.delete(`/api/blogs/${id}`).expect(200)
	})

})

describe('testing user creation', () => {
	test('missing name', async () => {
		const user = {name: 'name', password: 'password'}
		await api.post('/api/users').send(user).expect(400);
	})
	test('improper password', async () => {
		const user1 = {name: 'name', password: '12', username: 'username'}
		const user2 = {name: 'name', username: 'username'}
		await api.post('/api/users').send(user1).expect(400)
		await api.post('/api/users').send(user2).expect(400)
	})
})


after(async () => {
	await mongoose.connection.close();
})

