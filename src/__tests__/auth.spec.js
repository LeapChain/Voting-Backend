const { createSignature } = require("@leapchain/dleap");
const getOrCreateUser = require("../utils/getOrCreateUser");
const request = require("supertest");
const app = require("../../index");
const db = require("../db/testDb");
const User = require("../models/user");

let secretKey, publicKey, user, nonce;

beforeAll(async () => {
  await db.connect();
  secretKey =
    "705a3b36b44c2e95eebba870dc6fe5280c5c72783e2fe9449ebb73556faec57e";
  publicKey =
    "a5f0766103d33981ca0e90179fbd7ece2c9e76e0ea5d99ebb86cb80ff3c99ab9";
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

  it("should return 400 bad request if invalid signature", async () => {
    const user = await getOrCreateUser(publicKey);
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
    expect(res.body).toHaveProperty("errors");
    expect(res.body).toEqual(
      expect.objectContaining({
        errors: expect.arrayContaining([
          expect.objectContaining({
            msg: "Signature validation failed: Please sign the message with correct private key..",
            param: "signature",
            location: "body",
          }),
        ]),
      })
    );
  });
});
