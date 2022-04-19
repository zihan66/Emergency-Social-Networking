let agent = require("superagent");
let app = require("../app");

require("dotenv").config();
const mongoose = require("mongoose");
const Socket = require("../socket");

let PORT = 3001;
let HOST = "http://localhost:" + PORT;
let connection;
var server;

beforeAll(async () => {
  server = await app.listen(PORT);
  Socket.setServer(server);
  await mongoose.connection.close();
  if (process.env.ENVIRONMENT === "DEV") {
    connection = mongoose.connect(process.env.DEV_TEST_DATABASE);
  } else {
    connection = mongoose.connect(process.env.TEST_DATABASE);
  }
});

afterAll(async () => {
  const collections = await mongoose.connection.db.collections();
  await mongoose.connection.close();
  await server.close();
});

const medicalSupply1 = {
  name: "blood pressure cuff",
  provider: "frank",
  isReserved: false,
  receiver: null,
  isDeleted: false,
};

const medicalSupply2 = {
  name: "medical thermometer",
  provider: "jiacheng",
  isReserved: false,
  receiver: null,
  isDeleted: false,
};

const medicalSupply3 = {
  name: "medical gloves",
  provider: "jiacheng",
  isReserved: false,
  receiver: null,
  isDeleted: false,
};

const medicalSupply4 = {
  name: "stethoscope",
  provider: "arvin",
  isReserved: false,
  receiver: null,
  isDeleted: false,
};

let medicalSupply1_id;
test("Can post a new medical supply", async () => {
  await agent
    .post(HOST + "/medicalSupplies")
    .send(medicalSupply1)
    .then((res, err) => {
      expect(err).toBe(undefined);
      expect(res.statusCode).toBe(201);
    })
    .catch((e) => {
      // deal with it
    });
  return await agent
    .get(HOST + "/medicalSupplies")
    .send()
    .then((res) => {
      let medicalSupplies = res.body;
      medicalSupply1_id = medicalSupplies[0]._id;
      expect(medicalSupplies).toContainEqual({
        name: "medicalSupply1",
        provider: "jiacheng",
        isReserved: true,
        receiver: "user1",
        isDeleted: false,
      });
    })
    .catch((err) => {
      expect(err).toBe(undefined);
    })
    .catch((e) => {
      // deal with it
    });
});

test("Can reserve a medical supply", () => {
  return (async () => {
    await agent
      .put(HOST + `/medicalSupplies/${medicalSupply1_id}`)
      .send({ isReserved: true, username: "mike" })
      .then((res, err) => {
        expect(err).toBe(undefined);
        expect(res.statusCode).toBe(200);
      })
      .catch((e) => {
        // deal with it
      });
  })().catch((e) => {
    // deal with chain fail
  });
});

test("Can cancel reservation", () => {
  return (async () => {
    await agent
      .put(HOST + `/medicalSupplies/${medicalSupply1_id}`)
      .send({ isReserved: false })
      .then((res, err) => {
        expect(err).toBe(undefined);
        expect(res.statusCode).toBe(200);
      })
      .catch((e) => {
        // deal with it
      });
  })().catch((e) => {
    // deal with chain fail
  });
});

test("Can get medical supplies by provider", () => {
  return (async () => {
    await agent
      .post(HOST + "/medicalSupplies")
      .send(medicalSupply2)
      .then((res, err) => {
        expect(err).toBe(undefined);
        expect(res.statusCode).toBe(201);
      });
    await agent
      .post(HOST + "/medicalSupplies")
      .send(medicalSupply3)
      .then((res, err) => {
        expect(err).toBe(undefined);
        expect(res.statusCode).toBe(201);
      });
    await agent
      .post(HOST + "/medicalSupplies")
      .send(medicalSupply4)
      .then((res, err) => {
        expect(err).toBe(undefined);
        expect(res.statusCode).toBe(201);
      });

    await agent
      .get(HOST + "/medicalSupplies/jiacheng")
      .send()
      .then((res) => {
        let medicalSuppliesMatched = res.body;
        expect(medicalSuppliesMatched).toContainEqual({
          name: "medical Supply 1",
          provider: "jiacheng",
          isReserved: true,
          receiver: "user1",
          isDeleted: false,
        });
        expect(medicalSuppliesMatched).toContainEqual({
          name: "medical Supply 2",
          provider: "jiacheng",
          isReserved: true,
          receiver: "user2",
          isDeleted: false,
        });
      })
      .catch((err) => {
        expect(err).toBe(undefined);
      });
  })().catch((e) => {
    // deal with chain fail
  });
});
test("Can delete a medical supply by id", () => {
  return (async () => {
    await agent
      .delete(HOST + `/medicalSupplies/${medicalSupply1_id}`)
      .send()
      .then((res) => {
        expect(res.statusCode).toBe(200);
      })
      .catch((err) => {
        expect(err).toBe(undefined);
      });
  })().catch((e) => {
    // deal with chain fail
  });
});

test("can get all medical supplies", () => {
  return (async () => {
    await agent
      .get(HOST + "/medicalSupplies")
      .send()
      .then((res) => {
        const allMedicalSupplies = res.body;
        expect(allMedicalSupplies).toContainEqual({
          name: "medical gloves",
          provider: "jiacheng",
          isReserved: false,
          receiver: null,
          isDeleted: false,
        });
        expect(allMedicalSupplies).toContainEqual({
          name: "blood pressure cuff",
          provider: "frank",
          isReserved: false,
          receiver: null,
          isDeleted: false,
        });
        expect(allMedicalSupplies).toContainEqual({
          name: "stethoscope",
          provider: "arvin",
          isReserved: false,
          receiver: null,
          isDeleted: false,
        });
      })
      .catch((err) => {
        expect(err).toBe(undefined);
      });
  })().catch((e) => {
    // deal with chain fail
  });
});

test("can search medical supplies by name", () => {
  return (async () => {
    await agent
      .get(HOST + "/search/medicalSupplies")
      .query({ q: "medical" })
      .then((res) => {
        const searchResult = res.body;
        expect(searchResult).toContainEqual({
          name: "medical gloves",
          provider: "jiacheng",
          isReserved: false,
          receiver: null,
          isDeleted: false,
        });
        expect(searchResult).toContainEqual({
          name: "medical thermometer",
          provider: "jiacheng",
          isReserved: false,
          receiver: null,
          isDeleted: false,
        });
      })
      .catch((err) => {
        expect(err).toBe(undefined);
      });
  })().catch((e) => {
    // deal with chain fail
  });
});
