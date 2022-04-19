const Blog = require("../models/blog").Blog;

class normalStrategy {
  constructor() {
    this.createBlog = this.createBlog.bind(this);
    this.getBlogs = this.getBlogs.bind(this);
    this.getABlog = this.getABlog.bind(this);
    this.deleteABlog = this.deleteABlog.bind(this);
    this.likeABlog = this.likeABlog.bind(this);
    this.dislikeABlog = this.dislikeABlog.bind(this);
  }

  async createBlog(blog) {
    await Blog.create(blog);
    console.log("inside normal");
  }

  async getBlogs() {
    const searchWord = "blog";
    const blogs = await Blog.find({ type: searchWord });
    return blogs;
  }

  async getABlog(blogIDSearch) {
    const blogID = blogIDSearch;
    const blogs = await Blog.findOne({ _id: blogID });
    return blogs;
  }

  async deleteABlog(blogIDSearch) {
    const blogID = blogIDSearch;
    const blogs = await Blog.deleteOne({ _id: blogID });
    return blogs;
  }

  async likeABlog(blogIDSearch) {
    // if(!blogIDSearch){
    //   return null;
    // }
    const blogID = blogIDSearch;
    const blogs = await Blog.findOne({ _id: blogID });
    if(!blogs){
      // res.status(404).json({});
      return null;
    }
    const likeCount = blogs.likeCount + 1;
    try{
      await Blog.updateOne({ _id: blogIDSearch },{ likeCount: likeCount });
    } catch (error) {
      console.log("error", error);
      res.status(500).json({ error });
    }
  }

  async dislikeABlog(blogIDSearch) {

    const blogID = blogIDSearch;
    const blogs = await Blog.findOne({ _id: blogID });
    if(!blogs){
      return null;
    }
    const likeCount = blogs.likeCount - 1;
    try{
      await Blog.updateOne({ _id: blogIDSearch },{ likeCount: likeCount });
    } catch (error) {
      console.log("error", error);
      res.status(500).json({ error });
    }
  }

}


exports.normalStrategy = normalStrategy;

