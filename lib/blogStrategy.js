const Blog = require("../models/blog").Blog;
// const BlogTest = require("../models/blog").BlogTest;

class normalStrategy {
  constructor() {
    this.createBlog = this.createBlog.bind(this);
    this.getBlogs = this.getBlogs.bind(this);
    this.getABlog = this.getABlog.bind(this);
    this.deleteABlog = this.deleteABlog.bind(this);
  }

  async createBlog(blog) {
    await Blog.create(blog);
    console.log("inside normal");
  }

  async getBlogs() {
    const blogs = await Blog.find({ type: "blog" });
    return blogs;
  }

  async getABlog(blogIDSearch) {
    const blogs = await Blog.findOne({ _id: blogIDSearch });
    return blogs;
  }

  async deleteABlog(blogIDSearch) {
    const blogs = await Blog.deleteOne({ _id: blogIDSearch });
    return blogs;
  }

}

// class testStrategy {
//   constructor() {
//     this.createBlog = this.createBlog.bind(this);
//     this.getBlogs = this.getBlogs.bind(this);
//   }

//   async createBlog(blog) {
//     await BlogTest.create(blog);
//     console.log("inside test");
//   }

//   async getBlogs() {
//     const blogs = await BlogTest.find({ type: "blog" });
//     return blogs;
//   }
// }

exports.normalStrategy = normalStrategy;
// exports.testStrategy = testStrategy;
