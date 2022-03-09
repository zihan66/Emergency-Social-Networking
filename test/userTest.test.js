const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const User = require("../models/user");
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

test("It should be possible to save a new user", async () => {
  const hakan = new User({ username: "Hakan", password: "xyz567" });
  await hakan.save();
  const user = await User.findOne({ username: "Hakan" });
  expect(user.username).toBe(hakan.username);
});
