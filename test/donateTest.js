const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const brypt = require("bcrypt");
const Chat = require("../models/chat");

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


test("It should be possible to set a new donor", async () => {
    const hakan = new User({ username: "Hakan", password: "xyz567", isDonor: true});
    await hakan.save();
    const user = await User.findOne({ isDonor: true });
    expect(user.username).toBe(hakan.username);
});


test("It should be possible to get donor attribute", async () => {
    const Tony = new User({ username: "Tony", password:"123456", isLogin:false, isAcknowledge:false, lastStatusCode:"unknown", isDonor: false});
    await Tony.save();
    // User.updateOne({"username": "Tony"},{$set: {"password": "123321"}});
    const user = await User.findOne({ username: "Tony" });
    expect(user.username).toBe("Tony");
    expect(user.isLogin).toBe(false);
    expect(user.isAcknowledge).toBe(false);
    expect(user.lastStatusCode).toBe("unknown");
    expect(user.isDonor).toBe(false);
});


test("Should return correct blood type", async () => {
    const Tony = new User({ username: "Tony", password:"123456", isLogin:false, isAcknowledge:false, lastStatusCode:"OK", bloodType: "A"});
    await Tony.save();
    const user = await User.findOne({ username: "Tony" });
    expect(user.bloodType).toBe("A");
});


test("Should be able to create a chat between donor and receiver", async () => {
    const Biden = new User({ username: "biden", password:"123456", isLogin:true, isAcknowledge:true, lastStatusCode:"EMERGENCY", bloodType: "A"});
    const Tony = new User({ username: "tony", password:"123456", isLogin:true, isAcknowledge:true, lastStatusCode:"OK", bloodType: "A"});
    await Biden.save();
    await Tony.save();

    const askBloodChat = new Chat({
        username1: "biden",
        username2: "tony",
        chatID: new Date().getTime().toString(36),
    });

    const response = await askBloodChat.save();
    const chat = await Chat.findOne({ username1: "biden" });
    expect(chat.username2).toBe("tony");
});