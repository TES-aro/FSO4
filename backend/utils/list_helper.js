const dummy = (blogs) => {
	return 1
}

const totalLikes = (blogs) => {
	function countLikes (total, blog){
		return total + blog.likes;
	}
	return blogs.reduce(countLikes, 0)
}

const favouriteBlog = (blogs) => {
	let favourite = blogs[0];
	blogs.forEach(blog => {
		if (blog.likes > favourite.likes) {
			favourite = blog;
		}
	})
	return favourite;
}

const mostBlogs = (blogs) => {
	const writers = new Map()
	blogs.forEach(blog => {
		const writer = blog.author;
		const entries = writers.get(writer);
		if (entries){
			writers.set(writer, entries + 1);
		}
		else {
			writers.set(writer, 1);
		}
	})
	const mostActive =  {writer: "", blogs: 0}

	//console.log('end count:')
	writers.forEach((value, key) => {
		//console.log(`writer: ${key} blogs: ${value}`)
		if (value > mostActive.blogs) {
			mostActive.writer  = key
			mostActive.blogs = value
		}
	})
	return mostActive;
}

const mostLikes = (blogs) => {
	const writers = new Map()
	blogs.forEach(blog => {
		const writer = blog.author;
		const authorLikes = writers.get(writer);
		const blogLikes = blog.likes;
		if (authorLikes) {
			writers.set(writer, authorLikes + blogLikes)
		}
		else {
			writers.set(writer, blogLikes)
		}
	})
	const mostLiked = {writer: "", likes: 0};

	writers.forEach((value, key) => {
		console.log(`writer: ${key}, likes: ${value}`)
		if (value > mostLiked.likes){
			mostLiked.writer = key;
			mostLiked.likes = value;
		}
	})
	return mostLiked;
}

module.exports = {
	dummy,
	totalLikes,
	favouriteBlog,
	mostBlogs,
	mostLikes
}
