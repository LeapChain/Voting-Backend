const request = require("supertest");
const app = require("../../index");
const db = require("../db/testDb");
const { createSignature } = require("@leapchain/dleap");
const getOrCreateUser = require("../utils/getOrCreateUser");
const {
  GOVERNOR_REQUEST_FEE,
  TREASURY_ACCOUNT_NUMBER,
  MemoType,
} = require("../constants");

beforeAll(async () => {
  await db.connect();
  secretKey =
    "705a3b36b44c2e95eebba870dc6fe5280c5c72783e2fe9449ebb73556faec57e";
  publicKey =
    "a5f0766103d33981ca0e90179fbd7ece2c9e76e0ea5d99ebb86cb80ff3c99ab9";
});
beforeEach(async () => await db.clear());
afterAll(async () => await db.close());

const generateUserJWT = async () => {
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
  return { accessToken: res.body.accessToken, userId: user._id };
};

const generateGovernorJWT = async () => {
  const user = await getOrCreateUser(publicKey);
  user.type = "GOVERNER";
  user.save();
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
  return { accessToken: res.body.accessToken };
};

describe("POST /api/v1/users/create", () => {
  it("should return account number and nonce for valid request", async () => {
    const res = await request(app)
      .post("/api/v1/users/create")
      .send({
        accountNumber:
          "a5f0766103d33981ca0e90179fbd7ece2c9e76e0ea5d99ebb86cb80ff3c99ab9",
      })
      .set("Accept", "application/json");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("accountNumber");
    expect(res.body).toHaveProperty("nonce");
  });

  it("should return 400 bad request if account number invalid", async () => {
    const res = await request(app)
      .post("/api/v1/users/create")
      .send({
        accountNumber: "invalidAccountNumber",
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
        ]),
      })
    );
  });
});

describe("POST /api/v1/users/apply", () => {
  it("should check if the no authorization token passed", async () => {
    const res = await request(app)
      .post("/api/v1/users/apply")
      .send()
      .set("Accept", "application/json");
    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual(
      expect.objectContaining({
        msg: "Authentication Failed: Please include `Authorization: Bearer JWT` in your headers.",
      })
    );
  });

  it("should check if the valid JWT token passed", async () => {
    const res = await request(app)
      .post("/api/v1/users/apply")
      .send()
      .set("Accept", "application/json")
      .set("Authorization", "Bearer JWT");
    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual(
      expect.objectContaining({
        msg: "Authentication Failed: Invalid access token.",
      })
    );
  });

  it("should return 403 if the user is already a governor", async () => {
    const { accessToken } = await generateGovernorJWT();
    const res = await request(app)
      .post("/api/v1/users/apply")
      .send({
        accountNumber: publicKey,
      })
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${accessToken}`);
    expect(res.statusCode).toEqual(403);
    expect(res.body).toEqual(
      expect.objectContaining({
        msg: "user with type governer can not apply to be a governer",
      })
    );
  });

  it("should return payment info for valid request", async () => {
    const { accessToken, userId } = await generateUserJWT();
    const res = await request(app)
      .post("/api/v1/users/apply")
      .send({
        accountNumber: publicKey,
      })
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${accessToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("paymentInfo");
    expect(res.body).toHaveProperty("accountNumber");
    expect(res.body).toEqual(
      expect.objectContaining({
        paymentInfo: expect.objectContaining({
          accountNumber: TREASURY_ACCOUNT_NUMBER,
          metadata: `${MemoType.GOVERNER_REQUEST}_${userId}`,
          amount: GOVERNOR_REQUEST_FEE,
        }),
      })
    );
  });
});
