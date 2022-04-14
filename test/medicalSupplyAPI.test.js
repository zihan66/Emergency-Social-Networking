let agent = require("superagent");
let app = require("../app");

require("dotenv").config();
const mongoose = require("mongoose");
const Socket = require("../socket");

let PORT = 3000;
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
  for (let collection of collections) {
    await collection.deleteMany({});
  }
  await mongoose.connection.close();
  await server.close();
});

const medicalSupply1 = {
  name: "medical Supply 1",
  provider: "jiacheng",
  isReserved: true,
  receiver: "user1",
  isDeleted: false,
};
const medicalSupply2 = {
  name: "medical Supply 2",
  provider: "jiacheng",
  isReserved: true,
  receiver: "user2",
  isDeleted: false,
};
const medicalSupply3 = {
  name: "medical Supply 3",
  provider: "frank",
  isReserved: true,
  receiver: "user3",
  isDeleted: false,
};
// test("Can post a new medical supply", async () => {
//   // simpler version, not needing an anon function, just add "async" to function param
//   await agent
//     .post(HOST + "/medicalSupplies")
//     .send(medicalSupply1)
//     .then((res, err) => {
//       expect(err).toBe(undefined);
//       expect(res.statusCode).toBe(201);
//     })
//     .catch((e) => {
//       // deal with it
//     });
//   return await agent
//     .get(HOST + "/medicalSupplies")
//     .send()
//     .then((res) => {
//       let medicalSupplies = res.body;
//       console.log("medicalSupplies", medicalSupplies);
//       //console.log("medicalSuppliesName", medicalSupplies.name);
//       expect(medicalSupplies).toContainEqual({
//         name: "medicalSupply1",
//         provider: "jiacheng",
//         isReserved: true,
//         receiver: "user1",
//         isDeleted: false,
//       });
//     })
//     .catch((err) => {
//       expect(err).toBe(undefined);
//     })
//     .catch((e) => {
//       // deal with it
//     });
// });

test("Can get medical supplies by provider", () => {
  return (async () => {

    await agent
    .post(HOST + "/medicalSupplies")
    .send(medicalSupply1)
    .then((res, err) => {
      expect(err).toBe(undefined);
      expect(res.statusCode).toBe(201);
    });

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
      .get(HOST + "/medicalSupplies/jiacheng")
      .send()
      .then((err, res) => {
        //expect(err).toBe(null);
        console.log("response",res);
        let medicalSuppliesMatched = res.body;
        console.log("medicalSuppliesMatched ");
        console.log("medicalSuppliesMatched ", medicalSuppliesMatched);
        expect(medicalSuppliesMatched).toContainEqual({
          name: "medical Supply 1",
          provider: "jiacheng",
          isReserved: true,
          receiver: "user1",
          isDeleted: false,
        });
        //expect(users).toContain({ username: "002" });
      })
      .catch((err) => {
        expect(err).toBe(undefined);
      });
  })().catch((e) => {
    // deal with chain fail
  });
});

// test("Can search medical supply by name", () => {
//   return (async () => {
//     await agent
//       .post(HOST + "/medicalSupplies")
//       .send(medicalSupply1)
//       .then((res, err) => {
//         expect(err).toBe(undefined);
//         expect(res.statusCode).toBe(201);
//       })
//       .catch((e) => {
//         // deal with it
//       });

//     await agent
//       .post(HOST + "/users")
//       .send(medicalSupply2)
//       .then((res, err) => {
//         expect(err).toBe(undefined);
//         expect(res.statusCode).toBe(201);
//       })
//       .catch((e) => {
//         // deal with it
//       });

//     await agent
//       .get(HOST + "/medicalSupplies/search/name")
//       .query({ q:"1"})
//       .then((err, res) => {
//         expect(err).toBe(null);
//         let users = res.body;
//         expect(users).toContain({ name: "medical Supply 1" });
//         //expect(users).toContain({ username: "002" });
//       })
//       .catch((e) => {});
//   })().catch((e) => {
//     // deal with chain fail
//   });
// });
