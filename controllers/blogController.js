const moment = require("moment");
const normalStrategy = require("../lib/blogStrategy").normalStrategy;
const User = require("../models/user");
const socket = require("../socket");

class blogController {
  constructor(strategy) {
    this.strategy = strategy;
    this.createNewBlog = this.createNewBlog.bind(this);
    this.getBlog = this.getBlog.bind(this);
    this.getABlog = this.getABlog.bind(this);
    this.deleteABlog = this.deleteABlog.bind(this);
    this.likeABlog = this.likeABlog.bind(this);
    this.dislikeABlog = this.dislikeABlog.bind(this);
  }

  async createNewBlog(req, res) {
    try {
      const io = socket.getInstance();
      console.log(req.body);
      const user = await User.findOne({ username: req.body.username });
      const currentBlog = {
        content: req.body.content,
        author: req.body.username,
        deliveryStatus: user.lastStatusCode,
        postedAt: moment().format(),
        type: "blog",
        picture: req.body.picture,
        text: req.body.text,
      };
      console.log("currentBlog.picture: ",currentBlog.picture);
      await this.strategy.createBlog(currentBlog);
      io.sockets.emit("blog", currentBlog);
      res.status(201).json({});
    } catch (e) {
      console.log(e);
      res.status(500).send({ error: "error" });
    }
  }


  async getBlog(req, res) {
    try {
      const blog = await this.strategy.getBlogs();
      res.status(200).json(blog);
    } catch (error) {
      console.log(error);
    }
  }

  async getABlog(req, res) {
    try {
      const blogIDSearch = req.params.blogID;
      const blog = await this.strategy.getABlog(blogIDSearch);
      res.render("blog", { blog: blog });
      res.status(200).json(blog);
    } catch (error) {
      console.log(error);
    }
  }
  async deleteABlog(req, res){
    try {
      const blogIDSearch = req.params.blogID;
      const blog = await this.strategy.deleteABlog(blogIDSearch);
      res.status(200).json(blog);
    } catch (error) {
      console.log(error);
    }
  }
  async likeABlog(req, res){
    try {
      const blogIDSearch = req.params.blogID;
      const blog = await this.strategy.likeABlog(blogIDSearch);

      res.status(200).json(blog);
    } catch (error) {
      console.log(error);
    }
  }

  async dislikeABlog(req, res){
    try {
      const blogIDSearch = req.params.blogID;
      const blog = await this.strategy.dislikeABlog(blogIDSearch);
      res.status(200).json(blog);
    } catch (error) {
      console.log(error);
    }
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }
}



const ns = new normalStrategy();
blogController = new blogController(ns);

module.exports = blogController;
