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
let medicalSupply1_id;
test("find medical supplies by provider", async () => {
  const medicalSupply1 = new MedicalSupply({
    name: "blood pressure cuff",
    provider: "frank",
    isReserved: false,
    receiver: null,
    isDeleted: false,
  });
  const medicalSupply1Created = await medicalSupply1.save();
  medicalSupply1_id = medicalSupply1Created._id;
  const medicalSupply2 = new MedicalSupply({
    name: "medical thermometer",
    provider: "arvin",
    isReserved: false,
    receiver: null,
    isDeleted: false,
  });
  await medicalSupply2.save();
  const medicalSupply3 = new MedicalSupply({
    name: "medical gloves",
    provider: "arvin",
    isReserved: false,
    receiver: null,
    isDeleted: false,
  });
  await medicalSupply3.save();
  const result = await MedicalSupply.findMedicalSupplyByProvider("arvin");
  const expectResult = [
    {
      name: "medical thermometer",
      provider: "arvin",
      isReserved: false,
      receiver: null,
      isDeleted: false,
    },
    {
      name: "medical gloves",
      provider: "arvin",
      isReserved: false,
      receiver: null,
      isDeleted: false,
    },
  ];
  expect(result).toHaveLength(2);
  expect(result).toMatchObject(expectResult);
});

test("find all medical supplies", async () => {
  const result = await MedicalSupply.findAllMedicalSupply();
  const expectResult = [
    {
      name: "blood pressure cuff",
      provider: "frank",
      isReserved: false,
      receiver: null,
      isDeleted: false,
    },
    {
      name: "medical gloves",
      provider: "arvin",
      isReserved: false,
      receiver: null,
      isDeleted: false,
    },
    {
      name: "medical thermometer",
      provider: "arvin",
      isReserved: false,
      receiver: null,
      isDeleted: false,
    },
  ];
  expect(result).toHaveLength(3);
  // expect(result).toContain({
  //   name: "medical thermometer",
  //   provider: "arvin",
  //   isReserved: true,
  //   receiver: "user2",
  //   isDeleted: false,
  // });
  expect(result).toMatchObject(expectResult);
});

test("update a medical supply status to reserved", async () => {
  const result = await MedicalSupply.updateMedicalSupplyToReserved(
    medicalSupply1_id,
    "mike"
  );
  const medicalSupply = await MedicalSupply.findOne({ _id: medicalSupply1_id });

  expect(medicalSupply.isReserved).toBe(true);
  expect(medicalSupply.receiver).toBe("mike");
});

test("update a medical supply status to Notreserved", async () => {
  const result = await MedicalSupply.updateMedicalSupplyToNotReserved(
    medicalSupply1_id
  );
  const medicalSupply = await MedicalSupply.findOne({ _id: medicalSupply1_id });

  expect(medicalSupply.isReserved).toBe(false);
  expect(medicalSupply.receiver).toBe(null);
});

test("find  medical supplies by name", async () => {
  const result = await MedicalSupply.findMedicalSupplyByName("medical");
  expect(result).toHaveLength(2);
});

test("delete a medical supply", async () => {
  const result = await MedicalSupply.deleteMedicalSupplyById(medicalSupply1_id);
  const medicalSupply = await MedicalSupply.findOne({
    _id: medicalSupply1_id,
    isDeleted: false,
  });
  expect(medicalSupply).toBe(null);
});
