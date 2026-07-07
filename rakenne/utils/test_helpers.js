const Blog = require('../models/blog.js');

const notesList = [
	{
		title: "Naming Variables 101",
		author: "Moody Mary",
		url: "http://carexpratum.foo",
		likes: 20
	},{
		title: "this sould show up",
		author: "fuck me",
		url: "yeah!",
		likes: 0
	},{
		title: "Strange Love – or how I learned to stop worrying and love the type err…",
		author: "Dr Strange Law",
		url: "http://carexpratum.foo",
		likes: 10,
	},{
		title: "fuck Strange Love – or how I learned to stop worrying and love the typ…",
		author: "Dr Strange Law",
		url: "http://carexpratum.foo",
		likes: 70,
		comments: [
			"we all smell",
			"adding commetns",
			"add",
			"it was on the wrong side of bracket"
		]
	},{
		title: "test",
		author: "test",
		url: "http://url.fi",
		likes: 31,
	}
]

const initialNotes = [{
		title:  "Pain of Programming",
		author:  "Tate Tester",
		url:  "http://carexpratum.foo",
		likes: 9
	}]

console.log('connecting to mongoDB')

//const mongoUrl = `mongodb+srv://fullstack:${MONGO_PASSWORD}@cluster0.ngt2jxd.mongodb.net/?appName=Cluster0`

//mongoose.connect(mongoUrl, { family: 4 })

const setUp = async() => {
	await Blog.deleteMany({});
	const firstBlog = new Blog(initialNotes)
	await firstBlog.save()
}

module.exports = {
	notesList, initialNotes, setUp
}

