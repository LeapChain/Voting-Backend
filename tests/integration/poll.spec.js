const { createSignature } = require("@leapchain/dleap");
const request = require("supertest");
const app = require("../../index");
const db = require("../../src/db/testDb");

const Poll = require("../../src/models/Poll");
const getOrCreateUser = require("../../src/utils/getOrCreateUser");

beforeAll(async () => {
  await db.connect();
  secretKey =
    "0000000000000000000000000000000000000000000000000000000000000000";
  publicKey =
    "3b6a27bcceb6a42d62a3a8d02a6f0d73653215771de243a63ac048a18b59da29";
});
beforeEach(async () => await db.clear());
afterAll(async () => await db.close());

describe("GET /polls", () => {
  it("should return 200", async () => {
    const res = await request(app).get("/api/v1/polls");
    expect(res.statusCode).toEqual(200);
  });
});

describe("POST /polls", () => {
  it("should validate all fields", async () => {
    const res = await request(app).post("/api/v1/polls").send({});
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors).toHaveLength(7);
  });

  it("should validate accountNumber exists", async () => {
    const res = await request(app)
      .post("/api/v1/polls")
      .send({
        accountNumber: publicKey,
        message: {
          title: "test",
          description: "test",
          url: "test",
          nonce: "test",
          choices: [
            { title: "test", description: "test", url: "test" },
            { title: "test", description: "test", url: "test" },
          ],
        },
        signature:
          "0x000000000000000000000000000000000000000000000000000000000000000x00000000000000000000000000000000000000000000000000000000000000",
      });

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual(
      "User associated with accountNumber does not exist."
    );
  });

  it("should validate the signature of request", async () => {
    await getOrCreateUser(publicKey);
    const res = await request(app)
      .post("/api/v1/polls")
      .send({
        accountNumber: publicKey,
        message: {
          title: "test",
          description: "test",
          url: "test",
          nonce: "test",
          choices: [
            { title: "test", description: "test", url: "test" },
            { title: "test", description: "test", url: "test" },
          ],
        },
        signature:
          "0x000000000000000000000000000000000000000000000000000000000000000x00000000000000000000000000000000000000000000000000000000000000",
      });

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Invalid signature.");
  });

  it("should validate if the user is on governance", async () => {
    const user = await getOrCreateUser(publicKey);
    const message = {
      nonce: user.nonce,
      title: "test",
      description: "test",
      url: "test",
      choices: [
        { title: "test", description: "test", url: "test" },
        { title: "test", description: "test", url: "test" },
      ],
    };
    const signature = createSignature(JSON.stringify(message), secretKey);

    const res = await request(app).post("/api/v1/polls").send({
      accountNumber: publicKey,
      message,
      signature,
    });

    expect(res.statusCode).toEqual(403);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("User is not on governance.");
  });

  it("should create poll if everything is valid", async () => {
    const user = await getOrCreateUser(publicKey);
    user.type = "GOVERNOR";
    user.totalVotes = 100;
    await user.save();

    const message = {
      nonce: user.nonce,
      title: "test",
      description: "test",
      url: "test",
      choices: [
        { title: "test", description: "test", url: "test" },
        { title: "test", description: "test", url: "test" },
      ],
    };
    const signature = createSignature(JSON.stringify(message), secretKey);

    const res = await request(app).post("/api/v1/polls").send({
      accountNumber: publicKey,
      message,
      signature,
    });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("title");
    expect(res.body).toHaveProperty("description");
    expect(res.body).toHaveProperty("url");
    expect(res.body).toHaveProperty("nonce");
    expect(res.body).toHaveProperty("choices");
    expect(res.body).toHaveProperty("signature");
    expect(res.body).toHaveProperty("accountNumber");
    expect(res.body).toHaveProperty("status");
    expect(res.body).toHaveProperty("createdAt");
    expect(res.body).toHaveProperty("updatedAt");
    expect(res.body).toHaveProperty("_id");
    expect(res.body.choices.length).toEqual(2);
  });
});

describe("GET /polls/:id", () => {
  it("should return 400 bad request if invalid id", async () => {
    const res = await request(app).get("/api/v1/polls/randomID");
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body).toEqual(
      expect.objectContaining({
        errors: expect.arrayContaining([
          expect.objectContaining({
            msg: "id must be a vaild ObjectId",
            param: "id",
            location: "params",
          }),
        ]),
      })
    );
  });

  it("should return 404 if poll not found", async () => {
    const res = await request(app).get(
      "/api/v1/polls/5f6b8d6b8e6e9d1e9c6d7f0c"
    );
    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual(
      expect.objectContaining({
        message: "Poll not found.",
      })
    );
  });

  it("should return 200 if poll found", async () => {
    const poll = await Poll.create({
      accountNumber: publicKey,
      title: "test poll",
      description: "test poll description",
      url: "https://test.com",
      nonce: 123456,
      choices: [
        { title: "test choice", description: "test choice description" },
        { title: "test choice", description: "test choice description" },
      ],
      signature:
        "12345678912345678912345678912345678912345678912345678912345678901234567891234567891234567891234567891234567891234567891234567890",
    });

    const res = await request(app).get(`/api/v1/polls/${poll._id}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("title");
    expect(res.body).toHaveProperty("description");
    expect(res.body).toHaveProperty("url");
    expect(res.body).toHaveProperty("nonce");
    expect(res.body).toHaveProperty("choices");
    expect(res.body).toHaveProperty("signature");
    expect(res.body).toHaveProperty("accountNumber");
    expect(res.body).toHaveProperty("votes");
    expect(res.body).toHaveProperty("status");
    expect(res.body).toHaveProperty("createdAt");
    expect(res.body).toHaveProperty("updatedAt");
    expect(res.body).toHaveProperty("_id");
    expect(res.body.choices.length).toEqual(2);
  });
});
