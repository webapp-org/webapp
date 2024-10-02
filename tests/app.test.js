import supertest from "supertest";
import app from "../index.js";
import initializeDatabase from "../dbSetup/dbSetup.js";
import User from "../models/User.js";

beforeAll(async () => {
  await initializeDatabase();
});

// Test 1 - Create an account, and using the GET call, validate account exists.
describe("Integration Tests", () => {
  let createdUserId;
  let payload;

  test("Test 1 - Create an account, and using the GET call, validate account exists.", async () => {
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

    if (createdUserId) {
      await User.update({ isVerified: true }, { where: { id: createdUserId } });
      console.log("User verification status updated to true in the database");
    }

    // Get request to verify user
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

  test("Test 2: Update the user account and validate the account was updated", async () => {
    const updatePayload = {
      first_name: "Ashish",
      last_name: "Kumar",
      password: "ashish1234",
    };

    let authToken =
      "Basic " +
      Buffer.from(`${payload.username}:${payload.password}`).toString("base64");

    // Put request to update user account
    const updateResponse = await supertest(app)
      .put("/v1/user/self")
      .send(updatePayload)
      .set("Accept", "application/json")
      .set("Authorization", authToken);

    expect(updateResponse.status).toBe(204);

    authToken =
      "Basic " +
      Buffer.from(`${payload.username}:${updatePayload.password}`).toString(
        "base64"
      );

    // Get request to check updated user
    const getUserResponse = await supertest(app)
      .get("/v1/user/self")
      .set("Authorization", authToken);

    expect(getUserResponse.status).toBe(200);

    // Check if the retrieved user object has been updated with the new values
    expect(getUserResponse.body.first_name).toBe(updatePayload.first_name);
    expect(getUserResponse.body.last_name).toBe(updatePayload.last_name);
  });
});
