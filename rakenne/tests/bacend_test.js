const express = require('express');
const mongoose = require('mongoose');
const supertest = require('supertest');
const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')

const helper = require('../utils/test_helpers.js')
const app = require('../app.js');
const Blog = require('../models/blog.js');

const api = supertest(app);

beforeEach(helper.setUp())

describe('basic properties', () => {
	test('initial collection is of correct size', async () => {
		const response = await api.get('/api/blogs')
		console.log(response.body)
		assert.strictEqual(response.body.length, helper.initialNotes.length)
	})
	test('returns as JSON', async () => {
		await api.get('/api/blogs').expect(200).expect('Content-Type', /application\/json/)
	})
})

after( async () => {
	await mongoose.connection.close();
})
