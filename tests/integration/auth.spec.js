const { createSignature } = require("@leapchain/dleap");
const request = require("supertest");

const app = require("../../index");
const getOrCreateUser = require("../../src/utils/getOrCreateUser");
const db = require("../../src/db/testDb");

let secretKey, publicKey;

beforeAll(async () => {
  await db.connect();
  secretKey =
    "0000000000000000000000000000000000000000000000000000000000000000";
  publicKey =
    "3b6a27bcceb6a42d62a3a8d02a6f0d73653215771de243a63ac048a18b59da29";
});
beforeEach(async () => {
  await db.clear();
});
afterAll(async () => await db.close());

describe("POST /api/v1/auth", () => {
  it("should return JWT for valid request", async () => {
    const user = await getOrCreateUser(publicKey);
    const message = {
      nonce: user.nonce,
    };
    const signature = createSignature(JSON.stringify(message), secretKey);

    const res = await request(app)
      .post("/api/v1/auth")
      .send({
        accountNumber: publicKey,
        message: {
          nonce: user.nonce,
        },
        signature: signature,
      })
      .set("Accept", "application/json");
    expect(res.statusCode).toEqual(200);
    expect(res.body.nonce).not.toBe(user.nonce);
    expect(res.body).toHaveProperty("accessToken");
  });

  it("should return 400 if invalid parameters", async () => {
    const res = await request(app)
      .post("/api/v1/auth")
      .send({
        accountNumber: "",
        signature: "",
      })
      .set("Accept", "application/json");

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body).toEqual(
      expect.objectContaining({
        errors: expect.arrayContaining([
          expect.objectContaining({
            msg: "accountNumber must be 64 character long..",
            param: "accountNumber",
            location: "body",
          }),
          expect.objectContaining({
            msg: "signature must be 128 character long..",
            param: "signature",
            location: "body",
          }),
          expect.objectContaining({
            msg: "message.nonce field is required",
            param: "message.nonce",
            location: "body",
          }),
        ]),
      })
    );
  });

  it("should return 401 if invalid signature", async () => {
    await getOrCreateUser(publicKey);
    const res = await request(app)
      .post("/api/v1/auth")
      .send({
        accountNumber: publicKey,
        message: {
          nonce: 123456,
        },
        signature:
          "invalidSignatureOfTheMessageinvalidSignatureOfTheMessageinvalidSignatureOfTheMessageinvalidSignatureOfTheMessageinvalidSinvalidS",
      })
      .set("Accept", "application/json");

    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual(
      expect.objectContaining({
        message: "Invalid signature.",
      })
    );
  });
});
