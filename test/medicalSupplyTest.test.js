const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const MedicalSupply = require("../models/medicalSupply");
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

test("find medical supplies by provider", async () => {
  const medicalSupply1 = new MedicalSupply({
    name: "medical Supply 1",
    provider: "jiacheng",
    isReserved: true,
    receiver: "user1",
    isDeleted: false,
  });
  await medicalSupply1.save();
  const medicalSupply2 = new MedicalSupply({
    name: "medical Supply 2",
    provider: "jiacheng",
    isReserved: true,
    receiver: "user2",
    isDeleted: false,
  });
  await medicalSupply2.save();
  const medicalSupply3 = new MedicalSupply({
    name: "medical Supply 3",
    provider: "frank",
    isReserved: true,
    receiver: "user3",
    isDeleted: false,
  });
  await medicalSupply3.save();
  const result = await MedicalSupply.findMedicalSupplyByProvider("jiacheng");
  console.log(result);
  const expectResult = [
    {
      name: "medical Supply 1",
      provider: "jiacheng",
      isReserved: true,
      receiver: "user1",
      isDeleted: false,
    },
    {
      name: "medical Supply 2",
      provider: "jiacheng",
      isReserved: true,
      receiver: "user2",
      isDeleted: false,
    },
  ];
  expect(result).toHaveLength(2);
  expect(result).toMatchObject(expectResult);
});

test("It should be possible to delete a new medical supply", async () => {
  const medicalSupply1 = new MedicalSupply({
    name: "medical Supply 1",
    provider: "jiacheng",
    isReserved: true,
    receiver: "frank",
    isDeleted: false,
  });
  await medicalSupply1.save();
  await MedicalSupply.deleteMedicalSupplyById(medicalSupply1._id);
  const result = await MedicalSupply.findOne(medicalSupply1._id);
  expect(result.isDeleted).toBe(true);
});

// test("It should be possible to save a new message", async () => {
//   const message1 = new Message({
//     content: "123",
//     author: "Hakan",
//     target: "Tony",
//     postedAt: moment().format(),
//     deliveryStatus: "OK",
//     chatID: "345",
//     unread: true,
//   });
//   await message1.save();
//   const messageFound = await Message.findOne({ author: "Hakan" });
//   expect(messageFound.content).toBe(message1.content);
//   expect(messageFound.author).toBe(message1.author);
//   expect(messageFound.target).toBe(message1.target);
//   expect(messageFound.postedAt).toBe(message1.postedAt);
//   expect(messageFound.deliveryStatus).toBe(message1.deliveryStatus);
//   expect(messageFound.chatID).toBe(message1.chatID);
//   expect(messageFound.unread).toBe(message1.unread);
// });

// test("It should be possible to update a new message", async () => {
//   const message1 = new Message({
//     content: "123",
//     author: "Tom",
//     target: "Tony",
//     postedAt: moment().format(),
//     deliveryStatus: "OK",
//     chatID: "666",
//     unread: true,
//   });
//   await message1.save();
//   await Message.updateOne({ chatID: "666" }, { unread: false });
//   const messageFound = await Message.findOne({ chatID: "666" });
//   expect(messageFound.content).toBe(message1.content);
//   expect(messageFound.author).toBe(message1.author);
//   expect(messageFound.target).toBe(message1.target);
//   expect(messageFound.postedAt).toBe(message1.postedAt);
//   expect(messageFound.deliveryStatus).toBe(message1.deliveryStatus);
//   expect(messageFound.chatID).toBe(message1.chatID);
//   expect(messageFound.unread).toBe(false);
// });

// test("messagesAreIndependent", async () => {
//   const message1 = new Message({
//     content: "123",
//     author: "Tommy",
//     target: "Tommy1",
//     postedAt: moment().format(),
//     deliveryStatus: "OK",
//     chatID: "321",
//     unread: true,
//   });
//   await message1.save();
//   const message2 = new Message({
//     content: "321",
//     author: "Tommy2",
//     target: "Tommy3",
//     postedAt: moment().format(),
//     deliveryStatus: "OK",
//     chatID: "123",
//     unread: true,
//   });
//   await message2.save();
//   const messageFound1 = await Message.findOne({ chatID: "321" });
//   const messageFound2 = await Message.findOne({ chatID: "123" });
//   expect(messageFound1.content).not.toBe(messageFound2.content);
//   expect(messageFound1.author).not.toBe(messageFound2.author);
//   expect(messageFound1.target).not.toBe(messageFound2.target);
//   // expect(messageFound1.postedAt).not.toBe(messageFound2.postedAt);
//   // expect(messageFound.deliveryStatus).not.toBe(message1.deliveryStatus);
//   expect(messageFound1.chatID).not.toBe(messageFound2.chatID);
//   // expect(messageFound.unread).not.toBe(message1.unread);
// });
