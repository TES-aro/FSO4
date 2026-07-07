const mongoose = require('mongoose');
const supertest = require('supertest');
const { test, describe, beforeEach, after, before } = require('node:test')
const assert = require('node:assert')

const helper = require('../utils/test_helpers.js')
const app = require('../app.js');
const Blog = require('../models/blog.js');

const api = supertest(app);

beforeEach( async () => {
	await Blog.deleteMany({})
	console.log('clear')
	await Blog.insertMany(helper.initialNotes)
	//await helper.initialNotes.forEach(async (note) => {
	//	let newBlog = new Blog(note)
	//	await newBlog.save()
	//})
	console.log('added initial blogs')
})

describe('basic properties', () => {
	test('returns as JSON', async () => {
		await api.get('/api/blogs').expect(200).expect('Content-Type', /application\/json/)
	})
	test('initial collection is of correct size', async () => {
		const response = await api.get('/api/blogs');
		assert.strictEqual(response.body.length, helper.initialNotes.length)
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


after(async () => {
	await mongoose.connection.close();
})

