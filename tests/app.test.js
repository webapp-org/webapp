import supertest from "supertest";
import app from "../index.js";
import initializeDatabase from "../dbSetup/dbSetup.js";
import User from "../models/User.js";

beforeAll(async () => {
  await initializeDatabase();
});

// Test 1 - Create an account, and using the GET call, validate account exists.
describe("POST /v1/user", () => {
  let createdUserId;
  let payload;

  test("Test to create a new user", async () => {
    payload = {
      first_name: "Chinmay",
      last_name: "Gulhane",
      password: "chinmay1234",
      username: "chinmay@gmail.com",
    };

    // Post request to create a user
    const response = await supertest(app)
      .post("/v1/user")
      .send(payload)
      .set("Accept", "application/json");

    expect(response.status).toBe(201);
    createdUserId = response.body.id;
    expect(response.body).toHaveProperty("id");
  });

  test("Test to retrieve created user", async () => {
    const authHeader =
      "Basic " +
      Buffer.from(`${payload.username}:${payload.password}`).toString("base64");

    // Get request to check created User
    const getUserResponse = await supertest(app)
      .get("/v1/user/self")
      .set("Authorization", authHeader);

    expect(getUserResponse.status).toBe(200);

    // Check retrieved user properties
    expect(getUserResponse.body).toHaveProperty("id", createdUserId);
    expect(getUserResponse.body).toHaveProperty(
      "first_name",
      payload.first_name
    );
    expect(getUserResponse.body).toHaveProperty("last_name", payload.last_name);
    expect(getUserResponse.body).toHaveProperty("username", payload.username);
  });
});
