const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const brypt = require("bcrypt");

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

test("findAllUsersReturnAllUsers", async () => {
  const users = await User.findAllUsers();
  expect(users).toHaveLength(0);
  const Tony = new User({ username: "Tommy1", password:"123456", isLogin:false, isAcknowledge:false, lastStatusCode:"OK"});
  await Tony.save();
  const Tom = new User({ username: "Tommy2", password:"654321", isLogin:true, isAcknowledge:false, lastStatusCode:"unknown"});
  await Tom.save();
  const Hakan = new User({ username: "Tommy3", password:"654321", isLogin:false, isAcknowledge:true, lastStatusCode:"unknown"});
  await Hakan.save();
  const users2 = await User.findAllUsers();
  const expected_findAllUsers = [{"isLogin": true, "lastStatusCode": "unknown", "username": "Tommy2"}, {"isLogin": false, "lastStatusCode": "OK", "username": "Tommy1"}, {"isLogin": false, "lastStatusCode": "unknown", "username": "Tommy3"}];
  expect(users2).toHaveLength(3);
  expect(users2).toMatchObject(expected_findAllUsers);
});

test("It should be possible to save a new user", async () => {
  const hakan = new User({ username: "Hakan", password: "xyz567" });
  await hakan.save();
  const user = await User.findOne({ username: "Hakan" });
  expect(user.username).toBe(hakan.username);
});

test("basicSavingTest", async () => {
  const Tony = new User({ username: "Tony", password:"123456", isLogin:false, isAcknowledge:false, lastStatusCode:"unknown"});
  await Tony.save();
  // User.updateOne({"username": "Tony"},{$set: {"password": "123321"}});
  const user = await User.findOne({ username: "Tony" });
  expect(user.username).toBe("Tony");
  expect(user.isLogin).toBe(false);
  expect(user.isAcknowledge).toBe(false);
  expect(user.lastStatusCode).toBe("unknown");
});

test("basicIsLoginSavingTest", async () => {
  const Tony = new User({ username: "Tony", password:"123456", isLogin:false, isAcknowledge:false, lastStatusCode:"unknown"});
  await Tony.save();
  await User.updateOne(
      { username: "Tony" },
      { isLogin: true }
  );
  const user = await User.findOne({ username: "Tony" });
  expect(user.isLogin).toBe(true);
});

// test("isLoginSavingTest", async () => {
//   const Tony = new User({ username: "Tony", password:"123456", isLogin:false, isAcknowledge:false, lastStatusCode:"unknown"});
//   await Tony.save();
//   const user = await User.findOne({ username: "Tony" });
//   expect(user.isLogin).toBe(false);
  
// });


test("hashpasswordTest", async () => {
  const Tony = new User({ username: "Tony", password:"123456", isLogin:false, isAcknowledge:false, lastStatusCode:"unknown"});
  await Tony.save();
  let new_hashed_password = bcrypt.hashSync("123456", 6);
  const user = await User.findOne({ username: "Tony" });
  const isPasswordValid = brypt.compareSync(
    "123456",
    user.password
  );
  expect(isPasswordValid).toBe(true);
});


