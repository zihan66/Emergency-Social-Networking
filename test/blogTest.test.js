const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Blog = require("../models/blog").Blog;
const moment = require("moment");

let mongoServer;
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = await mongoServer.getUri();
  const mongooseOpts = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  };
  await mongoose.connect(uri, mongooseOpts);
});
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

test("It should be possible to save a new blog", async () => {
  const blog1 = new Blog({
    content: "112233",
    author: "Hakan1",
    postedAt: moment().format(),
    deliveryStatus: "OK",
    type: "blog",
    picture: "ambulance",
    text: "testText",
    prevContentLink: "null",
    nextContentLink: "null",
    likeCount: "0",
    dislikeCount: "0",
  });
  await blog1.save();
  const blogFound = await Blog.findOne({ author: "Hakan1" });
  expect(blogFound.content).toBe(blog1.content);
  expect(blogFound.author).toBe(blog1.author);
  expect(blogFound.postedAt).toBe(blog1.postedAt);
  expect(blogFound.deliveryStatus).toBe(blog1.deliveryStatus);
  expect(blogFound.type).toBe(blog1.type);
  expect(blogFound.picture).toBe(blog1.picture);
  expect(blogFound.text).toBe(blog1.text);
  expect(blogFound.prevContentLink).toBe(blog1.prevContentLink);
  expect(blogFound.nextContentLink).toBe(blog1.nextContentLink);
  expect(blogFound.likeCount).toBe(blog1.likeCount);
  expect(blogFound.dislikeCount).toBe(blog1.dislikeCount);
});


test("It should be possible to delete a new blog", async () => {
  const blog1 = new Blog({
    content: "112233",
    author: "HakanDelete",
    postedAt: moment().format(),
    deliveryStatus: "OK",
    type: "blog",
    picture: "ambulance",
    text: "testText",
    prevContentLink: "null",
    nextContentLink: "null",
    likeCount: "0",
    dislikeCount: "0",
  });
  await blog1.save();
  await blog1.remove();
  const blogFound = await Blog.findOne({ author: "HakanDelete" });
  expect(blogFound).toBe(null);
});

test("It should be possible to update a new blog", async () => {
  const blog1 = new Blog({
    content: "112233",
    author: "HakanUpdate",
    postedAt: moment().format(),
    deliveryStatus: "OK",
    type: "blog",
    picture: "ambulance",
    text: "testText",
    prevContentLink: "null",
    nextContentLink: "null",
    likeCount: "0",
    dislikeCount: "0",
  });
  await blog1.save();
  await Blog.updateOne({ author: "HakanUpdate" }, { text: "testText2" });
  const blogFound = await Blog.findOne({ author: "HakanUpdate" });
  expect(blogFound.content).toBe(blog1.content);
  expect(blogFound.author).toBe(blog1.author);
  expect(blogFound.postedAt).toBe(blog1.postedAt);
  expect(blogFound.deliveryStatus).toBe(blog1.deliveryStatus);
  expect(blogFound.type).toBe(blog1.type);
  expect(blogFound.picture).toBe(blog1.picture);
  expect(blogFound.text).toBe("testText2");
  expect(blogFound.prevContentLink).toBe(blog1.prevContentLink);
  expect(blogFound.nextContentLink).toBe(blog1.nextContentLink);
  expect(blogFound.likeCount).toBe(blog1.likeCount);
  expect(blogFound.dislikeCount).toBe(blog1.dislikeCount);
});

test("It should be possible to search for blogs", async () => {
  const blog1 = new Blog({
    content: "112233",
    author: "HakanSearch",
    postedAt: moment().format(),
    deliveryStatus: "OK",
    type: "blog",
    picture: "ambulance",
    text: "testText",
    prevContentLink: "null",
    nextContentLink: "null",
    likeCount: "0",
    dislikeCount: "0",
  });
  await blog1.save();
  // const blogSearchResult = await Blog.searchBlog("112233");
  // expect(blog1.content).toBe(blogSearchResult.content);
});